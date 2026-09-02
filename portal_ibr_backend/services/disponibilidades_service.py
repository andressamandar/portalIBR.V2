from datetime import datetime, timezone

from repositories.disponibilidades_repository import (
    DisponibilidadesRepository
)
from schemas.disponibilidade_schema import (
    DisponibilidadeSchema
)
from utils.exceptions import AppError
from utils.logger import logger
from utils.responses import error, success


def _serialize_disponibilidade(documento):
    if not documento:
        return None

    return {
        "_id": str(documento["_id"]),
        "integrante_id": documento.get(
            "integrante_id"
        ),
        "integrante_nome": documento.get(
            "integrante_nome"
        ),
        "ministerio": documento.get(
            "ministerio"
        ),
        "disponibilidades": documento.get(
            "disponibilidades",
            []
        ),
        "data_preenchimento": (
            documento.get(
                "data_preenchimento"
            ).isoformat()
            if documento.get(
                "data_preenchimento"
            )
            else None
        )
    }


def salvar_disponibilidade_service(data):
    try:
        dados = DisponibilidadeSchema.validar(
            data
        )

        dados["data_preenchimento"] = (
            datetime.now(timezone.utc)
        )

        DisponibilidadesRepository.salvar_ou_atualizar(
            integrante_id=dados["integrante_id"],
            ministerio=dados["ministerio"],
            dados=dados
        )

        disponibilidade = (
            DisponibilidadesRepository
            .buscar_por_integrante_e_ministerio(
                integrante_id=dados[
                    "integrante_id"
                ],
                ministerio=dados[
                    "ministerio"
                ]
            )
        )

        return success(
            data=_serialize_disponibilidade(
                disponibilidade
            ),
            message=(
                "Disponibilidade salva com sucesso."
            )
        )

    except AppError as e:
        return error(
            e.message,
            e.status
        )

    except Exception as e:
        logger.exception(
            "Erro ao salvar disponibilidade"
        )

        return error(str(e), 500)


def buscar_disponibilidade_integrante_service(
    integrante_id,
    ministerio
):
    try:
        if not ministerio:
            return error(
                "Ministério é obrigatório.",
                400
            )

        disponibilidade = (
            DisponibilidadesRepository
            .buscar_por_integrante_e_ministerio(
                integrante_id=integrante_id,
                ministerio=ministerio
            )
        )

        if not disponibilidade:
            return success(
                data=None
            )

        return success(
            data=_serialize_disponibilidade(
                disponibilidade
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao buscar disponibilidade "
            "do integrante"
        )

        return error(str(e), 500)


def listar_disponiveis_por_data_service(
    data_id,
    ministerio
):
    try:
        if not data_id:
            return error(
                "Data é obrigatória.",
                400
            )

        if not ministerio:
            return error(
                "Ministério é obrigatório.",
                400
            )

        documentos = list(
            DisponibilidadesRepository
            .listar_disponiveis_por_data(
                data_id=data_id,
                ministerio=ministerio
            )
        )

        integrantes = [
            {
                "integrante_id": documento.get(
                    "integrante_id"
                ),
                "integrante_nome": documento.get(
                    "integrante_nome"
                )
            }
            for documento in documentos
        ]

        return success(
            data=integrantes,
            total=len(integrantes)
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar integrantes "
            "disponíveis por data"
        )

        return error(str(e), 500)
    
    
def listar_disponibilidades_service(
        ministerio
    ):
    try:
        if not ministerio:
            return error(
                "Ministério é obrigatório.",
                400
            )

        documentos = list(
            DisponibilidadesRepository
            .listar_por_ministerio(
                ministerio
            )
        )

        disponibilidades = [
            _serialize_disponibilidade(
                documento
            )
            for documento in documentos
        ]

        return success(
            data=disponibilidades,
            total=len(disponibilidades)
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar disponibilidades"
        )

        return error(str(e), 500)
    
    
def listar_disponibilidades_limitadas_service(
    ministerio):
    try:
        if not ministerio:
            return error(
                "Ministério é obrigatório.",
                400
            )

        datas_abertas = (
            DisponibilidadesRepository
            .listar_datas_abertas(
                ministerio
            )
        )

        ids_datas_abertas = {
            str(data["_id"])
            for data in datas_abertas
        }

        documentos = list(
            DisponibilidadesRepository
            .listar_por_ministerio(
                ministerio
            )
        )

        resultado = []

        for documento in documentos:

            datas_disponiveis = [
                item.get("data")
                for item in documento.get(
                    "disponibilidades",
                    []
                )
                if (
                    item.get("data_id")
                    in ids_datas_abertas
                    and item.get("disponivel")
                    is True
                )
            ]

            if len(datas_disponiveis) <= 1:
                resultado.append({
                    "nome": documento.get(
                        "integrante_nome"
                    ),
                    "datas":
                        datas_disponiveis
                })

        return success(
            data=resultado,
            total=len(resultado)
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar disponibilidades limitadas"
        )

        return error(
            str(e),
            500
        )