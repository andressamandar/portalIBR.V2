from flask import Blueprint, request
from middlewares.auth_middleware import token_required
from services.integrantes_service import (
    listar_integrantes_service,
    listar_integrantes_login_service,
    buscar_integrante_service,
    cadastrar_integrante_service,
    editar_integrante_service,
    desativar_integrante_service,
    reativar_integrante_service
)

integrantes_bp = Blueprint(
    "integrantes",
    __name__,
    url_prefix="/api/integrantes"
)


@integrantes_bp.route("", methods=["GET"])
@token_required
def listar_integrantes():
    return listar_integrantes_service(request.args)

@integrantes_bp.route(
    "/login-opcoes",
    methods=["GET"]
)
def listar_integrantes_login():
    return listar_integrantes_login_service(
        request.args
    )


@integrantes_bp.route("/<id>", methods=["GET"])
def buscar_integrante(id):
    return buscar_integrante_service(id)


@integrantes_bp.route("", methods=["POST"])
def cadastrar_integrante():
    return cadastrar_integrante_service(request.get_json())


@integrantes_bp.route("/<id>", methods=["PUT"])
def editar_integrante(id):
    return editar_integrante_service(id, request.get_json())


@integrantes_bp.route("/<id>", methods=["DELETE"])
def excluir_integrante(id):
    return desativar_integrante_service(id)


@integrantes_bp.route("/<id>/reativar", methods=["PUT"])
def reativar_integrante(id):
    return reativar_integrante_service(id)