from flask import (
    Blueprint,
    request
)

from middlewares.auth_middleware import (
    require_permission
)

from services.solicitacoes_service import (
    listar_solicitacoes_service,
    buscar_solicitacao_service,
    cadastrar_solicitacao_service,
    converter_solicitacao_service
)


solicitacoes_bp = Blueprint(
    "solicitacoes",
    __name__,
    url_prefix="/api/solicitacoes"
)


# ==========================================
# NOVA SOLICITAÇÃO
# ==========================================

@solicitacoes_bp.route(
    "",
    methods=["POST"]
)
def cadastrar_solicitacao():
    return cadastrar_solicitacao_service(
        request.get_json()
    )


# ==========================================
# LISTAR SOLICITAÇÕES
# LIDERANÇA DA MÍDIA
# ==========================================

@solicitacoes_bp.route(
    "",
    methods=["GET"]
)
@require_permission(
    "gerenciar_solicitacoes"
)
def listar_solicitacoes():
    return listar_solicitacoes_service()


# ==========================================
# BUSCAR SOLICITAÇÃO
# ==========================================

@solicitacoes_bp.route(
    "/<id>",
    methods=["GET"]
)
@require_permission(
    "gerenciar_solicitacoes"
)
def buscar_solicitacao(id):
    return buscar_solicitacao_service(
        id
    )


# ==========================================
# CONVERTER EM TAREFA
# ==========================================

@solicitacoes_bp.route(
    "/<id>/converter",
    methods=["PUT"]
)
@require_permission(
    "gerenciar_solicitacoes"
)
def converter_solicitacao(id):
    return converter_solicitacao_service(
        id
    )