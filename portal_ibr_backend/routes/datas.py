from flask import Blueprint, request

from services.datas_service import (
    listar_datas_service,
    buscar_data_service,
    cadastrar_data_service,
    editar_data_service,
    desativar_data_service,
    marcar_escala_criada_service
)


datas_bp = Blueprint(
    "datas",
    __name__,
    url_prefix="/api/datas"
)


# =====================================
# LISTAR DATAS
# =====================================

@datas_bp.route("", methods=["GET"])
def listar_datas():
    return listar_datas_service(
        request.args
    )


# =====================================
# BUSCAR DATA
# =====================================

@datas_bp.route("/<id>", methods=["GET"])
def buscar_data(id):
    return buscar_data_service(id)


# =====================================
# CADASTRAR DATA
# =====================================

@datas_bp.route("", methods=["POST"])
def cadastrar_data():
    return cadastrar_data_service(
        request.get_json()
    )


# =====================================
# EDITAR DATA
# =====================================

@datas_bp.route("/<id>", methods=["PUT"])
def editar_data(id):
    return editar_data_service(
        id,
        request.get_json()
    )


# =====================================
# DESATIVAR DATA
# =====================================

@datas_bp.route("/<id>", methods=["DELETE"])
def excluir_data(id):
    return desativar_data_service(id)


# =====================================
# MARCAR ESCALA CRIADA
# =====================================

@datas_bp.route(
    "/<id>/escala-criada",
    methods=["PUT"]
)
def marcar_escala_criada(id):
    return marcar_escala_criada_service(id)