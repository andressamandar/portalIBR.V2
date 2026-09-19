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
from services.notificacoes_service import (
    NotificacoesService
)
from utils.exceptions import AppError
from utils.logger import logger
from utils.responses import error, success


STATUS_RECEBIDA = "Recebida"
STATUS_CONVERTIDA = "Convertida"

STATUS_TAREFA_A_FAZER = "A Fazer"


# ==========================================
# NOTIFICAÇÕES
# ==========================================

def _criar_notificacao_solicitacao(
    solicitacao,
    tipo
):
    if not solicitacao:
        return

    solicitante = solicitacao.get(
        "solicitante",
        ""
    )

    ministerio = solicitacao.get(
        "ministerio",
        ""
    )

    if tipo == "solicitacao_nova":

        titulo = "Nova solicitação"

        mensagem = (
            f"{solicitante} enviou uma "
            f"nova solicitação para "
            f"{ministerio}."
        )

    elif tipo == "solicitacao_editada":

        titulo = "Solicitação editada"

        mensagem = (
            f"{solicitante} editou uma "
            f"solicitação de "
            f"{ministerio}."
        )

    else:
        return

    try:

        NotificacoesService.criar(
            tipo=tipo,
            titulo=titulo,
            mensagem=mensagem,
            ministerio="Midia",
            destinatario_perfil=(
                "lideranca_midia"
            ),
            referencia_tipo=(
                "solicitacao"
            ),
            referencia_id=(
                solicitacao["_id"]
            )
        )

    except Exception:
        logger.exception(
            "Erro ao criar notificação "
            "de solicitação"
        )


# ==========================================
# SERIALIZAR SOLICITAÇÃO
# ==========================================

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
        "_id": str(
            solicitacao["_id"]
        ),

        "ministerio": solicitacao.get(
            "ministerio",
            ""
        ),

        "solicitante": solicitacao.get(
            "solicitante",
            ""
        ),

        "celular": solicitacao.get(
            "celular",
            ""
        ),

        "formatos_solicitados":
            solicitacao.get(
                "formatos_solicitados",
                []
            ),

        "descricao": solicitacao.get(
            "descricao",
            ""
        ),

        "sugestao_arte": solicitacao.get(
            "sugestao_arte",
            ""
        ),

        "data_evento": solicitacao.get(
            "data_evento",
            ""
        ),

        "horario_evento": solicitacao.get(
            "horario_evento",
            ""
        ),

        "data_entrega": solicitacao.get(
            "data_entrega",
            ""
        ),

        "status": solicitacao.get(
            "status",
            STATUS_RECEBIDA
        ),

        "tarefa_id": tarefa_id,

        "status_tarefa": status_tarefa,

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


# ==========================================
# LISTAR SOLICITAÇÕES
# LIDERANÇA
# ==========================================

def listar_solicitacoes_service(
    filtro=None
):
    try:

        solicitacoes = [
            serializar_solicitacao(
                solicitacao
            )
            for solicitacao
            in SolicitacoesRepository
            .listar(
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


# ==========================================
# BUSCAR SOLICITAÇÃO POR ID
# LIDERANÇA
# ==========================================

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


# ==========================================
# ACOMPANHAR SOLICITAÇÕES POR CELULAR
# PÚBLICO
# ==========================================

def acompanhar_solicitacoes_service(
    celular
):
    try:

        celular = str(
            celular
        ).strip()

        if not celular.isdigit():

            return error(
                (
                    "Informe somente os "
                    "números do celular."
                ),
                400
            )

        if len(celular) not in [
            10,
            11
        ]:

            return error(
                (
                    "Informe o celular "
                    "com DDD e número."
                ),
                400
            )

        solicitacoes = [
            serializar_solicitacao(
                solicitacao
            )
            for solicitacao
            in SolicitacoesRepository
            .listar(
                {
                    "celular": celular
                }
            )
        ]

        if not solicitacoes:

            return error(
                (
                    "Nenhuma solicitação "
                    "encontrada para este celular."
                ),
                404
            )

        return success(
            data=solicitacoes,
            total=len(
                solicitacoes
            )
        )

    except Exception as e:

        logger.exception(
            "Erro ao acompanhar solicitações"
        )

        return error(
            str(e),
            500
        )


# ==========================================
# CADASTRAR SOLICITAÇÃO
# ==========================================

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

        documento["_id"] = (
            resultado.inserted_id
        )

        _criar_notificacao_solicitacao(
            documento,
            "solicitacao_nova"
        )

        return success(
            data={
                "id": str(
                    resultado.inserted_id
                ),

                "protocolo":
                    dados["celular"]
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


# ==========================================
# CONVERTER SOLICITAÇÃO EM TAREFA
# ==========================================

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
                (
                    "Esta solicitação já foi "
                    "convertida em tarefa."
                ),
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

            "celular":
                solicitacao.get(
                    "celular",
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


# ==========================================
# EDITAR SOLICITAÇÃO
# PÚBLICO
# ==========================================

def editar_solicitacao_publica_service(
    id,
    celular,
    data
):
    try:

        celular = str(
            celular
        ).strip()

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
                "celular"
            )
            != celular
        ):

            return error(
                (
                    "Solicitação não encontrada "
                    "para este celular."
                ),
                404
            )

        tarefa = None

        if solicitacao.get(
            "tarefa_id"
        ):

            tarefa = (
                TarefasRepository
                .buscar_por_id(
                    solicitacao.get(
                        "tarefa_id"
                    )
                )
            )

            if tarefa:

                status_tarefa = (
                    tarefa.get(
                        "status"
                    )
                )

                if status_tarefa in [
                    "Fazendo",
                    "Concluído"
                ]:

                    return error(
                        (
                            "Esta solicitação não "
                            "pode mais ser editada, "
                            "pois já foi assumida "
                            "pela equipe."
                        ),
                        400
                    )

        dados_recebidos = dict(
            data or {}
        )

        # O celular é o protocolo.
        # Ele não pode ser alterado.
        dados_recebidos[
            "celular"
        ] = celular

        dados = (
            SolicitacaoSchema
            .validar(
                dados_recebidos
            )
        )

        SolicitacoesRepository.atualizar(
            id,
            {
                "ministerio":
                    dados[
                        "ministerio"
                    ],

                "solicitante":
                    dados[
                        "solicitante"
                    ],

                "celular":
                    celular,

                "formatos_solicitados":
                    dados[
                        "formatos_solicitados"
                    ],

                "descricao":
                    dados[
                        "descricao"
                    ],

                "sugestao_arte":
                    dados[
                        "sugestao_arte"
                    ],

                "data_evento":
                    dados[
                        "data_evento"
                    ],

                "horario_evento":
                    dados[
                        "horario_evento"
                    ],

                "data_entrega":
                    dados[
                        "data_entrega"
                    ]
            }
        )

        # Se a solicitação já virou tarefa,
        # mas ainda está em "A Fazer",
        # atualizamos a tarefa também.
        if tarefa:

            TarefasRepository.atualizar(
                solicitacao.get(
                    "tarefa_id"
                ),
                {
                    "ministerio":
                        dados[
                            "ministerio"
                        ],

                    "solicitante":
                        dados[
                            "solicitante"
                        ],

                    "celular":
                        celular,

                    "formatos_solicitados":
                        dados[
                            "formatos_solicitados"
                        ],

                    "descricao":
                        dados[
                            "descricao"
                        ],

                    "sugestao_arte":
                        dados[
                            "sugestao_arte"
                        ],

                    "data_evento":
                        dados[
                            "data_evento"
                        ],

                    "horario_evento":
                        dados[
                            "horario_evento"
                        ],

                    "data_entrega":
                        dados[
                            "data_entrega"
                        ]
                }
            )

        solicitacao_atualizada = (
            SolicitacoesRepository
            .buscar_por_id(
                id
            )
        )

        _criar_notificacao_solicitacao(
            solicitacao_atualizada,
            "solicitacao_editada"
        )

        return success(
            data=serializar_solicitacao(
                solicitacao_atualizada
            ),
            message=(
                "Solicitação atualizada "
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
            "Erro ao editar solicitação"
        )

        return error(
            str(e),
            500
        )