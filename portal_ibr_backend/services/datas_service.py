from datetime import datetime

from repositories.datas_repository import DatasRepository
from schemas.data_schema import DataSchema

from utils.responses import success, error
from utils.exceptions import AppError
from utils.logger import logger


def serialize_data(doc):
    return {
        "_id": str(doc["_id"]),
        "ministerio": doc.get("ministerio"),
        "data": doc.get("data"),
        "tipo": doc.get("tipo"),
        "nome_evento": doc.get("nome_evento"),
        "escala_criada": doc.get(
            "escala_criada",
            False
        ),
        "ativo": doc.get(
            "ativo",
            True
        ),
        "data_cadastro": (
            doc.get("data_cadastro").isoformat()
            if doc.get("data_cadastro")
            else None
        )
    }


def listar_datas_service(args):
    try:
        filtro = {
            "ativo": True
        }

        ministerio = args.get("ministerio")

        if ministerio:
            filtro["ministerio"] = ministerio

        datas = [
            serialize_data(data)
            for data in DatasRepository.listar(
                filtro
            )
        ]

        return success(
            data=datas,
            total=len(datas)
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar datas"
        )

        return error(
            str(e),
            500
        )


def buscar_data_service(id):
    try:
        data = DatasRepository.buscar_por_id(id)

        if not data:
            return error(
                "Data não encontrada.",
                404
            )

        return success(
            data=serialize_data(data)
        )

    except Exception as e:
        logger.exception(
            "Erro ao buscar data"
        )

        return error(
            str(e),
            500
        )


def cadastrar_data_service(data):
    try:
        dados = DataSchema.validar(data)

        duplicada = (
            DatasRepository.buscar_data_duplicada(
                dados["ministerio"],
                dados["data"]
            )
        )

        if duplicada:
            return error(
                "Já existe uma data cadastrada para este ministério.",
                400
            )

        documento = {
            **dados,
            "escala_criada": False,
            "ativo": True,
            "data_cadastro": datetime.utcnow()
        }

        resultado = (
            DatasRepository.cadastrar(
                documento
            )
        )

        return success(
            data={
                "id": str(
                    resultado.inserted_id
                )
            },
            message="Data cadastrada com sucesso.",
            status=201
        )

    except AppError as e:
        return error(
            e.message,
            e.status
        )

    except Exception as e:
        logger.exception(
            "Erro ao cadastrar data"
        )

        return error(
            str(e),
            500
        )


def editar_data_service(id, data):
    try:
        existente = (
            DatasRepository.buscar_por_id(id)
        )

        if not existente:
            return error(
                "Data não encontrada.",
                404
            )

        dados = DataSchema.validar(data)

        duplicada = (
            DatasRepository.buscar_data_duplicada(
                dados["ministerio"],
                dados["data"],
                id
            )
        )

        if duplicada:
            return error(
                "Já existe uma data cadastrada.",
                400
            )

        DatasRepository.atualizar(
            id,
            dados
        )

        return success(
            message="Data atualizada com sucesso."
        )

    except AppError as e:
        return error(
            e.message,
            e.status
        )

    except Exception as e:
        logger.exception(
            "Erro ao editar data"
        )

        return error(
            str(e),
            500
        )


def desativar_data_service(id):
    try:
        existente = (
            DatasRepository.buscar_por_id(id)
        )

        if not existente:
            return error(
                "Data não encontrada.",
                404
            )

        DatasRepository.desativar(id)

        return success(
            message="Data removida com sucesso."
        )

    except Exception as e:
        logger.exception(
            "Erro ao desativar data"
        )

        return error(
            str(e),
            500
        )


def marcar_escala_criada_service(id):
    try:
        existente = (
            DatasRepository.buscar_por_id(id)
        )

        if not existente:
            return error(
                "Data não encontrada.",
                404
            )

        DatasRepository.marcar_escala_criada(
            id
        )

        return success(
            message="Escala marcada como criada."
        )

    except Exception as e:
        logger.exception(
            "Erro ao marcar escala como criada"
        )

        return error(
            str(e),
            500
        )