from flask import Blueprint, request

from middlewares.auth_middleware import (
    token_required
)

from services.notificacoes_service import (
    NotificacoesService
)

from utils.responses import (
    success,
    error
)

from utils.exceptions import AppError


notificacoes_bp = Blueprint(
    "notificacoes",
    __name__,
    url_prefix="/api/notificacoes"
)


def obter_destinatario():

    usuario = request.usuario

    perfil = usuario.get(
        "perfil"
    )

    usuario_id = usuario.get(
        "id"
    )

    return perfil, usuario_id


@notificacoes_bp.route(
    "",
    methods=["GET"]
)
@token_required
def listar_notificacoes():

    try:

        perfil, usuario_id = (
            obter_destinatario()
        )

        notificacoes = (
            NotificacoesService
            .listar(
                perfil,
                usuario_id
            )
        )

        nao_lidas = len(
            [
                notificacao
                for notificacao
                in notificacoes
                if not notificacao["lida"]
            ]
        )

        return success(
            data={
                "notificacoes":
                    notificacoes,
                "nao_lidas":
                    nao_lidas
            },
            total=len(
                notificacoes
            )
        )

    except AppError as erro:

        return error(
            str(erro),
            erro.status_code
        )

    except Exception as erro:

        return error(
            str(erro),
            500
        )


@notificacoes_bp.route(
    "/nao-lidas",
    methods=["GET"]
)
@token_required
def contar_nao_lidas():

    try:

        perfil, usuario_id = (
            obter_destinatario()
        )

        quantidade = (
            NotificacoesService
            .contar_nao_lidas(
                perfil,
                usuario_id
            )
        )

        return success(
            data={
                "nao_lidas":
                    quantidade
            }
        )

    except AppError as erro:

        return error(
            str(erro),
            erro.status_code
        )

    except Exception as erro:

        return error(
            str(erro),
            500
        )


@notificacoes_bp.route(
    "/<id>/lida",
    methods=["PUT"]
)
@token_required
def marcar_como_lida(id):

    try:

        perfil, usuario_id = (
            obter_destinatario()
        )

        notificacao = (
            NotificacoesService
            .marcar_como_lida(
                id,
                perfil,
                usuario_id
            )
        )

        return success(
            data=notificacao,
            message=(
                "Notificação marcada "
                "como lida."
            )
        )

    except AppError as erro:

        return error(
            str(erro),
            erro.status_code
        )

    except Exception as erro:

        return error(
            str(erro),
            500
        )


@notificacoes_bp.route(
    "/marcar-todas-lidas",
    methods=["PUT"]
)
@token_required
def marcar_todas_como_lidas():

    try:

        perfil, usuario_id = (
            obter_destinatario()
        )

        (
            NotificacoesService
            .marcar_todas_como_lidas(
                perfil,
                usuario_id
            )
        )

        return success(
            message=(
                "Todas as notificações "
                "foram marcadas como lidas."
            )
        )

    except AppError as erro:

        return error(
            str(erro),
            erro.status_code
        )

    except Exception as erro:

        return error(
            str(erro),
            500
        )