from functools import wraps
from flask import request

from core.security import decodificar_token
from core.permissions import tem_permissao
from utils.responses import error


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return error("Token não informado.", 401)

        try:
            token = auth_header.replace("Bearer ", "")
            usuario = decodificar_token(token)
            request.usuario = usuario

        except Exception:
            return error("Token inválido ou expirado.", 401)

        return f(*args, **kwargs)

    return decorated


def require_permission(permissao):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):

            auth_header = request.headers.get("Authorization")

            if not auth_header:
                return error("Token não informado.", 401)

            try:
                token = auth_header.replace("Bearer ", "")
                usuario = decodificar_token(token)
                request.usuario = usuario

            except Exception:
                return error("Token inválido ou expirado.", 401)

            if not tem_permissao(usuario.get("perfil"), permissao):
                return error("Usuário sem permissão.", 403)

            return f(*args, **kwargs)

        return decorated

    return decorator