from datetime import datetime

from repositories.integrantes_repository import IntegrantesRepository
from schemas.integrante_schema import IntegranteSchema
from utils.responses import success, error
from utils.serializers import serialize_integrante
from utils.exceptions import AppError
from utils.logger import logger


def listar_integrantes_service(args):
    try:
        filtro = {}

        ministerio = args.get("ministerio")
        funcao = args.get("funcao")
        ativos = args.get("ativos")

        if ministerio:
            filtro["ministerios"] = ministerio

        if funcao:
            filtro["funcoes"] = funcao

        if ativos == "true":
            filtro["ativo"] = True

        integrantes = [
            serialize_integrante(i)
            for i in IntegrantesRepository.listar(filtro)
        ]

        return success(data=integrantes, total=len(integrantes))

    except Exception as e:
        logger.exception("Erro ao listar integrantes")
        return error(str(e), 500)
    
def listar_integrantes_login_service(args):
    try:
        ministerio = args.get("ministerio")

        if not ministerio:
            return error("Ministério é obrigatório.", 400)

        if ministerio not in ["Louvor", "Midia"]:
            return error("Ministério inválido.", 400)

        filtro = {
            "ministerios": ministerio,
            "ativo": True
        }

        integrantes = [
            {
                "id": str(integrante["_id"]),
                "nome": integrante["nome"]
            }
            for integrante in IntegrantesRepository.listar(filtro)
        ]

        return success(
            data=integrantes,
            total=len(integrantes)
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar integrantes para login"
        )

        return error(str(e), 500)


def buscar_integrante_service(id):
    try:
        integrante = IntegrantesRepository.buscar_por_id(id)

        if not integrante:
            return error("Integrante não encontrado.", 404)

        return success(data=serialize_integrante(integrante))

    except Exception as e:
        logger.exception("Erro ao buscar integrante")
        return error(str(e), 500)


def cadastrar_integrante_service(data):
    try:
        dados = IntegranteSchema.validar(data)

        if IntegrantesRepository.buscar_por_nome(dados["nome"]):
            return error("Já existe um integrante com este nome.", 400)

        documento = {
            **dados,
            "ativo": True,
            "data_cadastro": datetime.utcnow()
        }

        resultado = IntegrantesRepository.cadastrar(documento)

        return success(
            data={"id": str(resultado.inserted_id)},
            message="Integrante cadastrado com sucesso.",
            status=201
        )

    except AppError as e:
        return error(e.message, e.status)

    except Exception as e:
        logger.exception("Erro ao cadastrar integrante")
        return error(str(e), 500)


def editar_integrante_service(id, data):
    try:
        dados = IntegranteSchema.validar(data)

        if IntegrantesRepository.buscar_nome_duplicado(dados["nome"], id):
            return error("Já existe um integrante com este nome.", 400)

        IntegrantesRepository.atualizar(id, dados)

        return success(message="Integrante atualizado com sucesso.")

    except AppError as e:
        return error(e.message, e.status)

    except Exception as e:
        logger.exception("Erro ao editar integrante")
        return error(str(e), 500)


def desativar_integrante_service(id):
    try:
        IntegrantesRepository.desativar(id)

        return success(message="Integrante desativado com sucesso.")

    except Exception as e:
        logger.exception("Erro ao desativar integrante")
        return error(str(e), 500)


def reativar_integrante_service(id):
    try:
        IntegrantesRepository.reativar(id)

        return success(message="Integrante reativado com sucesso.")

    except Exception as e:
        logger.exception("Erro ao reativar integrante")
        return error(str(e), 500)