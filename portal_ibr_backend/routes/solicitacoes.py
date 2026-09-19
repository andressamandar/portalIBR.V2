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
    acompanhar_solicitacoes_service,
    cadastrar_solicitacao_service,
    editar_solicitacao_publica_service,
    converter_solicitacao_service
)


solicitacoes_bp = Blueprint(
    "solicitacoes",
    __name__,
    url_prefix="/api/solicitacoes"
)


# ==========================================
# NOVA SOLICITAÇÃO
# PÚBLICO
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
# ACOMPANHAR SOLICITAÇÕES POR CELULAR
# PÚBLICO
# ==========================================

@solicitacoes_bp.route(
    "/acompanhar/<celular>",
    methods=["GET"]
)
def acompanhar_solicitacoes(
    celular
):
    return acompanhar_solicitacoes_service(
        celular
    )


# ==========================================
# EDITAR SOLICITAÇÃO
# PÚBLICO
# ==========================================

@solicitacoes_bp.route(
    "/acompanhar/<celular>/<id>",
    methods=["PUT"]
)
def editar_solicitacao_publica(
    celular,
    id
):
    return editar_solicitacao_publica_service(
        id,
        celular,
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
# BUSCAR SOLICITAÇÃO POR ID
# LIDERANÇA DA MÍDIA
# ==========================================

@solicitacoes_bp.route(
    "/<id>",
    methods=["GET"]
)
@require_permission(
    "gerenciar_solicitacoes"
)
def buscar_solicitacao(
    id
):
    return buscar_solicitacao_service(
        id
    )


# ==========================================
# CONVERTER EM TAREFA
# LIDERANÇA DA MÍDIA
# ==========================================

@solicitacoes_bp.route(
    "/<id>/converter",
    methods=["PUT"]
)
@require_permission(
    "gerenciar_solicitacoes"
)
def converter_solicitacao(
    id
):
    return converter_solicitacao_service(
        id
    )