from datetime import datetime, timezone

from repositories.louvores_escala_repository import (
    LouvoresEscalaRepository
)
from schemas.louvor_escala_schema import (
    LouvorEscalaSchema
)
from utils.exceptions import AppError
from utils.logger import logger
from utils.responses import error, success


def _enriquecer_louvores_escala(documento):
    if not documento:
        return None

    itens = documento.get(
        "louvores",
        []
    )

    ids = [
        item.get("louvor_id")
        for item in itens
        if item.get("louvor_id")
    ]

    louvores = (
        LouvoresEscalaRepository
        .buscar_louvores_por_ids(ids)
    )

    louvores_por_id = {
        str(louvor["_id"]): louvor
        for louvor in louvores
    }

    louvores_enriquecidos = []

    for item in itens:
        louvor_id = item.get(
            "louvor_id"
        )

        louvor = louvores_por_id.get(
            louvor_id
        )

        if not louvor:
            continue

        tom_escala = item.get(
            "tom",
            ""
        )

        louvores_enriquecidos.append({
            "louvor_id": louvor_id,

            "louvor": louvor.get(
                "louvor",
                ""
            ),

            "link": louvor.get(
                "link",
                ""
            ),

            "categoria": louvor.get(
                "categoria",
                ""
            ),

            "tom": (
                tom_escala
                or louvor.get(
                    "tom",
                    ""
                )
            )
        })

    return {
        "_id": str(
            documento["_id"]
        ),

        "ministerio": documento.get(
            "ministerio"
        ),

        "data_id": documento.get(
            "data_id"
        ),

        "louvores": louvores_enriquecidos,

        "ultima_atualizacao": (
            documento.get(
                "ultima_atualizacao"
            ).isoformat()
            if documento.get(
                "ultima_atualizacao"
            )
            else None
        )
    }


def buscar_louvores_por_data_service(
    data_id,
    ministerio
):
    try:
        if not ministerio:
            return error(
                "Ministério é obrigatório.",
                400
            )

        documento = (
            LouvoresEscalaRepository
            .buscar_por_data(
                data_id=data_id,
                ministerio=ministerio
            )
        )

        if not documento:
            return success(
                data=None
            )

        return success(
            data=_enriquecer_louvores_escala(
                documento
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao buscar louvores da escala"
        )

        return error(
            str(e),
            500
        )


def salvar_louvores_escala_service(
    data
):
    try:
        dados = LouvorEscalaSchema.validar(
            data
        )

        dados["ultima_atualizacao"] = (
            datetime.now(timezone.utc)
        )

        (
            LouvoresEscalaRepository
            .salvar_ou_atualizar(
                data_id=dados[
                    "data_id"
                ],
                ministerio=dados[
                    "ministerio"
                ],
                dados=dados
            )
        )

        documento = (
            LouvoresEscalaRepository
            .buscar_por_data(
                data_id=dados[
                    "data_id"
                ],
                ministerio=dados[
                    "ministerio"
                ]
            )
        )

        return success(
            data=_enriquecer_louvores_escala(
                documento
            ),
            message=(
                "Louvores da escala salvos com sucesso."
            )
        )

    except AppError as e:
        return error(
            e.message,
            e.status
        )

    except Exception as e:
        logger.exception(
            "Erro ao salvar louvores da escala"
        )

        return error(
            str(e),
            500
        )


def listar_louvores_escala_service(
    ministerio
):
    try:
        filtro = {}

        if ministerio:
            filtro["ministerio"] = (
                ministerio
            )

        documentos = [
            _enriquecer_louvores_escala(
                documento
            )
            for documento in (
                LouvoresEscalaRepository
                .listar(filtro)
            )
        ]

        return success(
            data=documentos,
            total=len(documentos)
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar louvores das escalas"
        )

        return error(
            str(e),
            500
        )