import jwt
from datetime import datetime, timedelta

from config import Config


def validar_senha(perfil, senha):
    senha_correta = Config.SENHAS.get(perfil)
    return senha_correta is not None and senha == senha_correta


def gerar_token(usuario):
    payload = {
        "id": usuario.get("id"),
        "nome": usuario.get("nome"),
        "perfil": usuario.get("perfil"),
        "exp": datetime.utcnow() + timedelta(hours=8)
    }

    return jwt.encode(
        payload,
        Config.JWT_SECRET,
        algorithm="HS256"
    )


def decodificar_token(token):
    return jwt.decode(
        token,
        Config.JWT_SECRET,
        algorithms=["HS256"]
    )