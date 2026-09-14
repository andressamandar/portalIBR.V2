from flask import Blueprint, request

from middlewares.auth_middleware import (
    require_permission
)

from services.tarefas_service import (
    listar_tarefas_service,
    buscar_tarefa_service,
    cadastrar_tarefa_service,
    editar_tarefa_service,
    excluir_tarefa_service,
    assumir_tarefa_service,
    concluir_tarefa_service
)


tarefas_bp = Blueprint(
    "tarefas",
    __name__,
    url_prefix="/api/tarefas"
)


@tarefas_bp.route(
    "",
    methods=["GET"]
)
@require_permission(
    "visualizar_tarefas"
)
def listar_tarefas():
    return listar_tarefas_service()


@tarefas_bp.route(
    "/<id>",
    methods=["GET"]
)
@require_permission(
    "visualizar_tarefas"
)
def buscar_tarefa(id):
    return buscar_tarefa_service(
        id
    )


@tarefas_bp.route(
    "",
    methods=["POST"]
)
@require_permission(
    "gerenciar_tarefas"
)
def cadastrar_tarefa():
    return cadastrar_tarefa_service(
        request.get_json()
    )


@tarefas_bp.route(
    "/<id>",
    methods=["PUT"]
)
@require_permission(
    "gerenciar_tarefas"
)
def editar_tarefa(id):
    return editar_tarefa_service(
        id,
        request.get_json()
    )


@tarefas_bp.route(
    "/<id>",
    methods=["DELETE"]
)
@require_permission(
    "gerenciar_tarefas"
)
def excluir_tarefa(id):
    return excluir_tarefa_service(
        id
    )


@tarefas_bp.route(
    "/<id>/assumir",
    methods=["PUT"]
)
@require_permission(
    "assumir_tarefa"
)
def assumir_tarefa(id):
    return assumir_tarefa_service(
        id,
        request.usuario
    )


@tarefas_bp.route(
    "/<id>/concluir",
    methods=["PUT"]
)
@require_permission(
    "concluir_tarefa"
)
def concluir_tarefa(id):
    return concluir_tarefa_service(
        id,
        request.usuario
    )