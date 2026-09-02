from flask import Blueprint, request

from services.louvores_escala_service import (
    buscar_louvores_por_data_service,
    listar_louvores_escala_service,
    salvar_louvores_escala_service
)


louvores_escala_bp = Blueprint(
    "louvores_escala",
    __name__,
    url_prefix="/api/louvores-escala"
)


@louvores_escala_bp.route(
    "",
    methods=["GET"]
)
def listar_louvores_escala():

    return listar_louvores_escala_service(
        ministerio=request.args.get(
            "ministerio"
        )
    )


@louvores_escala_bp.route(
    "/data/<data_id>",
    methods=["GET"]
)
def buscar_louvores_por_data(
    data_id
):

    return buscar_louvores_por_data_service(
        data_id=data_id,
        ministerio=request.args.get(
            "ministerio"
        )
    )


@louvores_escala_bp.route(
    "",
    methods=["POST"]
)
def salvar_louvores_escala():

    return salvar_louvores_escala_service(
        request.get_json(
            silent=True
        ) or {}
    )