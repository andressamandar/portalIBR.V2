from flask import Blueprint, request

from services.louvores_service import (
    buscar_louvor_por_id_service,
    cadastrar_louvor_service,
    editar_louvor_service,
    excluir_louvor_service,
    listar_louvores_service
)


louvores_bp = Blueprint(
    "louvores",
    __name__,
    url_prefix="/api/louvores"
)


@louvores_bp.route(
    "",
    methods=["GET"]
)
def listar_louvores():

    return listar_louvores_service()


@louvores_bp.route(
    "/<louvor_id>",
    methods=["GET"]
)
def buscar_louvor(
    louvor_id
):

    return buscar_louvor_por_id_service(
        louvor_id
    )


@louvores_bp.route(
    "",
    methods=["POST"]
)
def cadastrar_louvor():

    return cadastrar_louvor_service(
        request.get_json(
            silent=True
        ) or {}
    )


@louvores_bp.route(
    "/<louvor_id>",
    methods=["PUT"]
)
def editar_louvor(
    louvor_id
):

    return editar_louvor_service(
        louvor_id,
        request.get_json(
            silent=True
        ) or {}
    )


@louvores_bp.route(
    "/<louvor_id>",
    methods=["DELETE"]
)
def excluir_louvor(
    louvor_id
):

    return excluir_louvor_service(
        louvor_id
    )