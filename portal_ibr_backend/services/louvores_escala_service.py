from datetime import datetime, timezone

from repositories.escalas_repository import (
    EscalasRepository
)
from repositories.louvores_escala_repository import (
    LouvoresEscalaRepository
)
from schemas.louvor_escala_schema import (
    LouvorEscalaSchema
)
from services.notificacoes_service import (
    NotificacoesService
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


def _formatar_data(data):
    if not data:
        return ""

    try:
        data_convertida = (
            datetime.strptime(
                data,
                "%Y-%m-%d"
            )
        )

        return data_convertida.strftime(
            "%d/%m/%Y"
        )

    except Exception:
        return data


def _normalizar_louvores(
    louvores
):
    return [
        {
            "louvor_id": str(
                item.get(
                    "louvor_id",
                    ""
                )
            ),
            "tom": (
                item.get(
                    "tom",
                    ""
                )
                or ""
            ).strip()
        }
        for item in (
            louvores
            or []
        )
    ]


def _louvores_foram_alterados(
    documento_anterior,
    novos_louvores
):
    if not documento_anterior:
        return True

    louvores_anteriores = (
        _normalizar_louvores(
            documento_anterior.get(
                "louvores",
                []
            )
        )
    )

    louvores_novos = (
        _normalizar_louvores(
            novos_louvores
        )
    )

    return (
        louvores_anteriores
        != louvores_novos
    )


def _obter_integrantes_escala(
    escala
):
    integrantes_ids = set()

    if not escala:
        return integrantes_ids

    for ids_funcao in escala.get(
        "funcoes",
        {}
    ).values():

        for integrante_id in (
            ids_funcao
        ):
            integrantes_ids.add(
                str(
                    integrante_id
                )
            )

    return integrantes_ids


def _criar_notificacoes_louvores(
    data_id,
    ministerio,
    tipo
):
    if ministerio != "Louvor":
        return

    escala = (
        EscalasRepository
        .buscar_por_data_id(
            data_id=data_id,
            ministerio=ministerio
        )
    )

    if not escala:
        return

    integrantes_ids = (
        _obter_integrantes_escala(
            escala
        )
    )

    if not integrantes_ids:
        return

    data_formatada = (
        _formatar_data(
            escala.get(
                "data"
            )
        )
    )

    if tipo == "louvores_definidos":

        titulo = (
            "Louvores definidos"
        )

        mensagem = (
            "Os louvores da escala de "
            f"{data_formatada} "
            "foram definidos."
        )

    else:

        titulo = (
            "Louvores alterados"
        )

        mensagem = (
            "Houve alteração nos louvores "
            "da escala de "
            f"{data_formatada}."
        )

    for integrante_id in (
        integrantes_ids
    ):
        try:
            NotificacoesService.criar(
                tipo=tipo,
                titulo=titulo,
                mensagem=mensagem,
                ministerio="Louvor",
                destinatario_perfil=(
                    "integrante_louvor"
                ),
                destinatario_id=(
                    integrante_id
                ),
                referencia_tipo=(
                    "louvores_escala"
                ),
                referencia_id=(
                    escala["_id"]
                )
            )

        except Exception:
            logger.exception(
                "Erro ao criar notificação "
                "de louvores para o integrante "
                f"{integrante_id}"
            )


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
        dados = (
            LouvorEscalaSchema.validar(
                data
            )
        )

        documento_anterior = (
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

        primeira_definicao = (
            documento_anterior
            is None
        )

        houve_alteracao = (
            _louvores_foram_alterados(
                documento_anterior,
                dados.get(
                    "louvores",
                    []
                )
            )
        )

        dados[
            "ultima_atualizacao"
        ] = datetime.now(
            timezone.utc
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

        if houve_alteracao:

            if primeira_definicao:

                tipo_notificacao = (
                    "louvores_definidos"
                )

            else:

                tipo_notificacao = (
                    "louvores_alterados"
                )

            _criar_notificacoes_louvores(
                data_id=dados[
                    "data_id"
                ],
                ministerio=dados[
                    "ministerio"
                ],
                tipo=tipo_notificacao
            )

        return success(
            data=_enriquecer_louvores_escala(
                documento
            ),
            message=(
                "Louvores da escala "
                "salvos com sucesso."
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
            total=len(
                documentos
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar louvores "
            "das escalas"
        )

        return error(
            str(e),
            500
        )