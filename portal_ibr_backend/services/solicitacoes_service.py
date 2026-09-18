from datetime import datetime

from repositories.solicitacoes_repository import (
    SolicitacoesRepository
)

from repositories.tarefas_repository import (
    TarefasRepository
)

from schemas.solicitacao_schema import (
    SolicitacaoSchema
)

from utils.responses import (
    success,
    error
)

from utils.exceptions import (
    AppError
)

from utils.logger import (
    logger
)


STATUS_RECEBIDA = "Recebida"
STATUS_CONVERTIDA = "Convertida"

STATUS_TAREFA_A_FAZER = "A Fazer"


def serializar_solicitacao(
    solicitacao
):
    tarefa_id = solicitacao.get(
        "tarefa_id"
    )

    status_tarefa = None


    if tarefa_id:

        try:

            tarefa = (
                TarefasRepository
                .buscar_por_id(
                    tarefa_id
                )
            )


            if tarefa:

                status_tarefa = (
                    tarefa.get(
                        "status"
                    )
                )

        except Exception:

            status_tarefa = None


    return {
        "_id":
            str(
                solicitacao["_id"]
            ),

        "ministerio":
            solicitacao.get(
                "ministerio",
                ""
            ),

        "solicitante":
            solicitacao.get(
                "solicitante",
                ""
            ),

        "formatos_solicitados":
            solicitacao.get(
                "formatos_solicitados",
                []
            ),

        "descricao":
            solicitacao.get(
                "descricao",
                ""
            ),

        "sugestao_arte":
            solicitacao.get(
                "sugestao_arte",
                ""
            ),

        "data_evento":
            solicitacao.get(
                "data_evento",
                ""
            ),

        "horario_evento":
            solicitacao.get(
                "horario_evento",
                ""
            ),

        "data_entrega":
            solicitacao.get(
                "data_entrega",
                ""
            ),

        "status":
            solicitacao.get(
                "status",
                STATUS_RECEBIDA
            ),

        "tarefa_id":
            tarefa_id,

        "status_tarefa":
            status_tarefa,

        "data_cadastro": (
            solicitacao.get(
                "data_cadastro"
            ).isoformat()
            if solicitacao.get(
                "data_cadastro"
            )
            else None
        )
    }


def listar_solicitacoes_service(
    filtro=None
):
    try:

        solicitacoes = [
            serializar_solicitacao(
                solicitacao
            )
            for solicitacao
            in SolicitacoesRepository.listar(
                filtro
            )
        ]


        return success(
            data=solicitacoes,
            total=len(
                solicitacoes
            )
        )

    except Exception as e:

        logger.exception(
            "Erro ao listar solicitações"
        )


        return error(
            str(e),
            500
        )


def buscar_solicitacao_service(
    id
):
    try:

        solicitacao = (
            SolicitacoesRepository
            .buscar_por_id(
                id
            )
        )


        if not solicitacao:

            return error(
                "Solicitação não encontrada.",
                404
            )


        return success(
            data=serializar_solicitacao(
                solicitacao
            )
        )

    except Exception as e:

        logger.exception(
            "Erro ao buscar solicitação"
        )


        return error(
            str(e),
            500
        )


def cadastrar_solicitacao_service(
    data
):
    try:

        dados = (
            SolicitacaoSchema
            .validar(
                data
            )
        )


        documento = {
            **dados,

            "status":
                STATUS_RECEBIDA,

            "tarefa_id":
                None,

            "data_cadastro":
                datetime.utcnow()
        }


        resultado = (
            SolicitacoesRepository
            .cadastrar(
                documento
            )
        )


        return success(
            data={
                "id":
                    str(
                        resultado.inserted_id
                    )
            },
            message=(
                "Solicitação enviada "
                "com sucesso."
            ),
            status=201
        )

    except AppError as e:

        return error(
            e.message,
            e.status
        )

    except Exception as e:

        logger.exception(
            "Erro ao cadastrar solicitação"
        )


        return error(
            str(e),
            500
        )


def converter_solicitacao_service(
    id
):
    try:

        solicitacao = (
            SolicitacoesRepository
            .buscar_por_id(
                id
            )
        )


        if not solicitacao:

            return error(
                "Solicitação não encontrada.",
                404
            )


        if (
            solicitacao.get(
                "status"
            )
            == STATUS_CONVERTIDA
            or solicitacao.get(
                "tarefa_id"
            )
        ):

            return error(
                "Esta solicitação já foi "
                "convertida em tarefa.",
                400
            )


        documento_tarefa = {
            "ministerio":
                solicitacao.get(
                    "ministerio",
                    ""
                ),

            "solicitante":
                solicitacao.get(
                    "solicitante",
                    ""
                ),

            "formatos_solicitados":
                solicitacao.get(
                    "formatos_solicitados",
                    []
                ),

            "descricao":
                solicitacao.get(
                    "descricao",
                    ""
                ),

            "sugestao_arte":
                solicitacao.get(
                    "sugestao_arte",
                    ""
                ),

            "data_evento":
                solicitacao.get(
                    "data_evento",
                    ""
                ),

            "horario_evento":
                solicitacao.get(
                    "horario_evento",
                    ""
                ),

            "data_entrega":
                solicitacao.get(
                    "data_entrega",
                    ""
                ),

            "status":
                STATUS_TAREFA_A_FAZER,

            "responsavel_id":
                None,

            "responsavel_nome":
                None,

            "data_cadastro":
                datetime.utcnow()
        }


        resultado_tarefa = (
            TarefasRepository
            .cadastrar(
                documento_tarefa
            )
        )


        tarefa_id = str(
            resultado_tarefa.inserted_id
        )


        SolicitacoesRepository.atualizar(
            id,
            {
                "status":
                    STATUS_CONVERTIDA,

                "tarefa_id":
                    tarefa_id
            }
        )


        return success(
            data={
                "tarefa_id":
                    tarefa_id
            },
            message=(
                "Solicitação convertida "
                "em tarefa com sucesso."
            )
        )

    except Exception as e:

        logger.exception(
            "Erro ao converter solicitação "
            "em tarefa"
        )


        return error(
            str(e),
            500
        )