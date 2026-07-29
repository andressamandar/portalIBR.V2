from flask import Blueprint, request

from database.mongo import db
from core.security import validar_senha, gerar_token
from utils.responses import success, error

usuarios_bp = Blueprint(
    "usuarios",
    __name__,
    url_prefix="/api/usuarios"
)


def retornar_login(usuario):
    token = gerar_token(usuario)

    return success(data={
        "usuario": usuario,
        "token": token
    })


@usuarios_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    perfil = data.get("perfil")
    senha = data.get("senha")
    nome = data.get("nome")

    # Liderança Louvor
    if perfil == "lideranca_louvor":

        if not validar_senha("lideranca_louvor", senha):
            return error("Senha inválida.", 401)

        usuario = {
            "id": None,
            "nome": "Liderança Louvor",
            "perfil": "lideranca_louvor"
        }

        return retornar_login(usuario)

    # Liderança Mídia
    if perfil == "lideranca_midia":

        if not validar_senha("lideranca_midia", senha):
            return error("Senha inválida.", 401)

        usuario = {
            "id": None,
            "nome": "Liderança Mídia",
            "perfil": "lideranca_midia"
        }

        return retornar_login(usuario)


    # Integrante Louvor
    if perfil == "integrante_louvor":

        integrante = db.integrantes.find_one({
            "nome": nome,
            "ministerios": "Louvor",
            "ativo": True
        })

        if not integrante:
            return error("Integrante não encontrado.", 404)

        if not validar_senha("integrante_louvor", senha):
            return error("Senha inválida.", 401)

        usuario = {
            "id": str(integrante["_id"]),
            "nome": integrante["nome"],
            "perfil": "integrante_louvor"
        }

        return retornar_login(usuario)

    # Integrante Mídia
    if perfil == "integrante_midia":

        integrante = db.integrantes.find_one({
            "nome": nome,
            "ministerios": "Midia",
            "ativo": True
        })

        if not integrante:
            return error("Integrante não encontrado.", 404)

        if not validar_senha("integrante_midia", senha):
            return error("Senha inválida.", 401)

        usuario = {
            "id": str(integrante["_id"]),
            "nome": integrante["nome"],
            "perfil": "integrante_midia"
        }

        return retornar_login(usuario)

    return error("Perfil inválido.", 400)