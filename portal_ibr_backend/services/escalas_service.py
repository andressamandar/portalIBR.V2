from datetime import datetime, timezone

from repositories.escalas_repository import EscalasRepository
from schemas.escala_schema import EscalaSchema
from utils.exceptions import AppError
from utils.logger import logger
from utils.responses import error, success
from utils.serializers import serialize_escala


def _enriquecer_escala(escala):
    ids = set()

    for integrantes_ids in escala.get("funcoes", {}).values():
        ids.update(integrantes_ids)

    integrantes = EscalasRepository.buscar_integrantes_por_ids(
        list(ids)
    )

    integrantes_por_id = {
        str(integrante["_id"]): integrante
        for integrante in integrantes
    }

    return serialize_escala(
        escala,
        integrantes_por_id
    )


def listar_escalas_service(args):
    try:
        filtro = {}

        ministerio = args.get("ministerio")
        data_id = args.get("data_id")

        if ministerio:
            filtro["ministerio"] = ministerio

        if data_id:
            filtro["data_id"] = data_id

        escalas = [
            _enriquecer_escala(escala)
            for escala in EscalasRepository.listar(filtro)
        ]

        return success(
            data=escalas,
            total=len(escalas)
        )

    except Exception as e:
        logger.exception("Erro ao listar escalas")
        return error(str(e), 500)


def buscar_escala_por_id_service(escala_id):
    try:
        escala = EscalasRepository.buscar_por_id(escala_id)

        if not escala:
            return error("Escala não encontrada.", 404)

        return success(
            data=_enriquecer_escala(escala)
        )

    except Exception as e:
        logger.exception("Erro ao buscar escala")
        return error(str(e), 500)


def buscar_escala_por_data_service(data_id, ministerio=None):
    try:
        escala = EscalasRepository.buscar_por_data_id(
            data_id=data_id,
            ministerio=ministerio
        )

        if not escala:
            return success(data=None)

        return success(
            data=_enriquecer_escala(escala)
        )

    except Exception as e:
        logger.exception("Erro ao buscar escala por data")
        return error(str(e), 500)


def criar_escala_service(data):
    try:
        dados = EscalaSchema.validar(data)

        escala_existente = EscalasRepository.buscar_por_data_id(
            data_id=dados["data_id"],
            ministerio=dados["ministerio"]
        )

        if escala_existente:
            return error(
                "Já existe uma escala para esta data e ministério.",
                409
            )

        agora = datetime.now(timezone.utc)

        documento = {
            **dados,
            "data_criacao": agora,
            "ultima_atualizacao": agora
        }

        resultado = EscalasRepository.cadastrar(documento)

        EscalasRepository.marcar_data_com_escala(
            dados["data_id"],
            True
        )

        escala_criada = EscalasRepository.buscar_por_id(
            str(resultado.inserted_id)
        )

        return success(
            data=_enriquecer_escala(escala_criada),
            message="Escala criada com sucesso.",
            status=201
        )

    except AppError as e:
        return error(e.message, e.status)

    except Exception as e:
        logger.exception("Erro ao criar escala")
        return error(str(e), 500)


def editar_escala_service(escala_id, data):
    try:
        escala_atual = EscalasRepository.buscar_por_id(escala_id)

        if not escala_atual:
            return error("Escala não encontrada.", 404)

        dados_recebidos = {
            "ministerio": data.get(
                "ministerio",
                escala_atual.get("ministerio")
            ),
            "data_id": data.get(
                "data_id",
                escala_atual.get("data_id")
            ),
            "data": data.get(
                "data",
                escala_atual.get("data")
            ),
            "funcoes": data.get(
                "funcoes",
                escala_atual.get("funcoes", {})
            )
        }

        dados = EscalaSchema.validar(dados_recebidos)

        outra_escala = EscalasRepository.buscar_por_data_id(
            data_id=dados["data_id"],
            ministerio=dados["ministerio"]
        )

        if (
            outra_escala
            and str(outra_escala["_id"]) != escala_id
        ):
            return error(
                "Já existe outra escala para esta data e ministério.",
                409
            )

        dados["ultima_atualizacao"] = datetime.now(timezone.utc)

        EscalasRepository.atualizar(
            escala_id,
            dados
        )

        escala_atualizada = EscalasRepository.buscar_por_id(
            escala_id
        )

        return success(
            data=_enriquecer_escala(escala_atualizada),
            message="Escala atualizada com sucesso."
        )

    except AppError as e:
        return error(e.message, e.status)

    except Exception as e:
        logger.exception("Erro ao editar escala")
        return error(str(e), 500)


def excluir_escala_service(escala_id):
    try:
        escala = EscalasRepository.buscar_por_id(escala_id)

        if not escala:
            return error("Escala não encontrada.", 404)

        EscalasRepository.excluir(escala_id)

        EscalasRepository.marcar_data_com_escala(
            escala["data_id"],
            False
        )

        return success(
            message="Escala excluída com sucesso."
        )

    except Exception as e:
        logger.exception("Erro ao excluir escala")
        return error(str(e), 500)