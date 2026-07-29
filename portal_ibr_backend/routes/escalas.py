from flask import Blueprint, request

from services.escalas_service import (
    buscar_escala_por_data_service,
    buscar_escala_por_id_service,
    criar_escala_service,
    editar_escala_service,
    excluir_escala_service,
    listar_escalas_service
)

escalas_bp = Blueprint(
    "escalas",
    __name__,
    url_prefix="/api/escalas"
)


@escalas_bp.route("", methods=["GET"])
def listar_escalas():
    return listar_escalas_service(request.args)


@escalas_bp.route("/<escala_id>", methods=["GET"])
def buscar_escala(escala_id):
    return buscar_escala_por_id_service(escala_id)


@escalas_bp.route("/data/<data_id>", methods=["GET"])
def buscar_escala_por_data(data_id):
    return buscar_escala_por_data_service(
        data_id=data_id,
        ministerio=request.args.get("ministerio")
    )


@escalas_bp.route("", methods=["POST"])
def criar_escala():
    return criar_escala_service(
        request.get_json(silent=True) or {}
    )


@escalas_bp.route("/<escala_id>", methods=["PUT"])
def editar_escala(escala_id):
    return editar_escala_service(
        escala_id,
        request.get_json(silent=True) or {}
    )


@escalas_bp.route("/<escala_id>", methods=["DELETE"])
def excluir_escala(escala_id):
    return excluir_escala_service(escala_id)