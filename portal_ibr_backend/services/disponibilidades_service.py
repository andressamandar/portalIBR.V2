from datetime import datetime, timezone

from repositories.datas_repository import (
    DatasRepository
)
from repositories.disponibilidades_repository import (
    DisponibilidadesRepository
)
from schemas.disponibilidade_schema import (
    DisponibilidadeSchema
)
from services.notificacoes_service import (
    NotificacoesService
)
from utils.exceptions import AppError
from utils.logger import logger
from utils.responses import error, success


def _serialize_disponibilidade(
    documento
):
    if not documento:
        return None

    return {
        "_id": str(
            documento["_id"]
        ),
        "integrante_id":
            documento.get(
                "integrante_id"
            ),
        "integrante_nome":
            documento.get(
                "integrante_nome"
            ),
        "ministerio":
            documento.get(
                "ministerio"
            ),
        "disponibilidades":
            documento.get(
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


def _obter_perfil_lideranca(
    ministerio
):
    if ministerio == "Louvor":
        return "lideranca_louvor"

    if ministerio == "Midia":
        return "lideranca_midia"

    return None


def _validar_datas_bloqueadas(
    dados,
    disponibilidade_anterior
):
    disponibilidades_anteriores = {}

    if disponibilidade_anterior:
        disponibilidades_anteriores = {
            item.get("data_id"): item
            for item
            in disponibilidade_anterior.get(
                "disponibilidades",
                []
            )
        }

    for item in dados.get(
        "disponibilidades",
        []
    ):
        data_id = item.get(
            "data_id"
        )

        if not data_id:
            continue

        data_escala = (
            DatasRepository
            .buscar_por_id(
                data_id
            )
        )

        if not data_escala:
            raise AppError(
                "Data não encontrada.",
                404
            )

        if (
            data_escala.get(
                "ministerio"
            )
            != dados.get(
                "ministerio"
            )
        ):
            raise AppError(
                "A data não pertence "
                "ao ministério informado.",
                400
            )

        if not data_escala.get(
            "escala_criada",
            False
        ):
            continue

        disponibilidade_anterior_item = (
            disponibilidades_anteriores
            .get(
                data_id
            )
        )

        if (
            disponibilidade_anterior_item
            is None
        ):
            raise AppError(
                (
                    "Escala para essa data "
                    "já criada. Para alterações, "
                    "informe a liderança."
                ),
                400
            )

        valor_anterior = (
            disponibilidade_anterior_item
            .get(
                "disponivel"
            )
        )

        novo_valor = item.get(
            "disponivel"
        )

        if (
            valor_anterior
            != novo_valor
        ):
            raise AppError(
                (
                    "Escala para essa data "
                    "já criada. Para alterações, "
                    "informe a liderança."
                ),
                400
            )


def _criar_notificacao_disponibilidade(
    disponibilidade,
    era_nova
):
    if not disponibilidade:
        return

    ministerio = disponibilidade.get(
        "ministerio"
    )

    integrante_nome = disponibilidade.get(
        "integrante_nome"
    )

    perfil_lideranca = (
        _obter_perfil_lideranca(
            ministerio
        )
    )

    if not perfil_lideranca:
        return

    if era_nova:
        tipo = (
            "disponibilidade_salva"
        )

        titulo = (
            "Disponibilidade salva"
        )

        mensagem = (
            f"{integrante_nome} salvou "
            f"sua disponibilidade no "
            f"{ministerio}."
        )

    else:
        tipo = (
            "disponibilidade_alterada"
        )

        titulo = (
            "Disponibilidade alterada"
        )

        mensagem = (
            f"{integrante_nome} alterou "
            f"sua disponibilidade no "
            f"{ministerio}."
        )

    try:
        NotificacoesService.criar(
            tipo=tipo,
            titulo=titulo,
            mensagem=mensagem,
            ministerio=ministerio,
            destinatario_perfil=(
                perfil_lideranca
            ),
            referencia_tipo=(
                "disponibilidade"
            ),
            referencia_id=(
                disponibilidade["_id"]
            )
        )

    except Exception:
        logger.exception(
            "Erro ao criar notificação "
            "de disponibilidade"
        )


def salvar_disponibilidade_service(
    data
):
    try:
        dados = (
            DisponibilidadeSchema.validar(
                data
            )
        )

        disponibilidade_anterior = (
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

        era_nova = (
            disponibilidade_anterior
            is None
        )

        _validar_datas_bloqueadas(
            dados,
            disponibilidade_anterior
        )

        dados["data_preenchimento"] = (
            datetime.now(
                timezone.utc
            )
        )

        (
            DisponibilidadesRepository
            .salvar_ou_atualizar(
                integrante_id=dados[
                    "integrante_id"
                ],
                ministerio=dados[
                    "ministerio"
                ],
                dados=dados
            )
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

        _criar_notificacao_disponibilidade(
            disponibilidade,
            era_nova
        )

        return success(
            data=(
                _serialize_disponibilidade(
                    disponibilidade
                )
            ),
            message=(
                "Disponibilidade salva "
                "com sucesso."
            )
        )

    except AppError as e:
        return error(
            e.message,
            e.status
        )

    except Exception as e:
        logger.exception(
            "Erro ao salvar "
            "disponibilidade"
        )

        return error(
            str(e),
            500
        )


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
                integrante_id=
                    integrante_id,
                ministerio=
                    ministerio
            )
        )

        if not disponibilidade:
            return success(
                data=None
            )

        return success(
            data=(
                _serialize_disponibilidade(
                    disponibilidade
                )
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao buscar "
            "disponibilidade do integrante"
        )

        return error(
            str(e),
            500
        )


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
                "integrante_id":
                    documento.get(
                        "integrante_id"
                    ),

                "integrante_nome":
                    documento.get(
                        "integrante_nome"
                    )
            }

            for documento
            in documentos
        ]

        return success(
            data=integrantes,
            total=len(
                integrantes
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar integrantes "
            "disponíveis por data"
        )

        return error(
            str(e),
            500
        )


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

            for documento
            in documentos
        ]

        return success(
            data=disponibilidades,
            total=len(
                disponibilidades
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar "
            "disponibilidades"
        )

        return error(
            str(e),
            500
        )


def listar_disponibilidades_limitadas_service(
    ministerio
):
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
            str(
                data["_id"]
            )

            for data
            in datas_abertas
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
                item.get(
                    "data"
                )

                for item
                in documento.get(
                    "disponibilidades",
                    []
                )

                if (
                    item.get(
                        "data_id"
                    )
                    in ids_datas_abertas

                    and item.get(
                        "disponivel"
                    )
                    is True
                )
            ]

            if len(
                datas_disponiveis
            ) <= 1:

                resultado.append({
                    "nome":
                        documento.get(
                            "integrante_nome"
                        ),

                    "datas":
                        datas_disponiveis
                })

        return success(
            data=resultado,
            total=len(
                resultado
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar "
            "disponibilidades limitadas"
        )

        return error(
            str(e),
            500
        )