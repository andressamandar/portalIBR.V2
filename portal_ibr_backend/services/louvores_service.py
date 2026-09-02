from bson import ObjectId
from repositories.louvores_repository import (  LouvoresRepository)
from schemas.louvor_schema import (LouvorSchema)
from utils.exceptions import AppError
from utils.logger import logger
from utils.responses import error, success


def _serialize_louvor(documento):
    if not documento:
        return None

    return {
        "_id": str(documento["_id"]),
        "louvor": documento.get(
            "louvor",
            ""
        ),
        "link": documento.get(
            "link",
            ""
        ),
        "tom": documento.get(
            "tom",
            ""
        ),
        "categoria": documento.get(
            "categoria",
            ""
        )
    }

def listar_louvores_service():
    try:
        louvores = [
            _serialize_louvor(
                documento
            )
            for documento
            in LouvoresRepository.listar()
        ]

        return success(
            data=louvores,
            total=len(louvores)
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar louvores"
        )

        return error(
            str(e),
            500
        )


def buscar_louvor_por_id_service(
    louvor_id
):
    try:
        if not ObjectId.is_valid(
            louvor_id
        ):
            return error(
                "Identificador do louvor é inválido.",
                400
            )

        louvor = (
            LouvoresRepository
            .buscar_por_id(
                louvor_id
            )
        )

        if not louvor:
            return error(
                "Louvor não encontrado.",
                404
            )

        return success(
            data=_serialize_louvor(
                louvor
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao buscar louvor"
        )

        return error(
            str(e),
            500
        )


def cadastrar_louvor_service(
    data
):
    try:
        dados = LouvorSchema.validar(
            data
        )

        existente = (
            LouvoresRepository
            .buscar_por_nome(
                dados["louvor"]
            )
        )

        if existente:
            return error(
                "Já existe um louvor com este nome.",
                409
            )

        resultado = (
            LouvoresRepository
            .cadastrar(
                dados
            )
        )

        louvor_criado = (
            LouvoresRepository
            .buscar_por_id(
                str(
                    resultado.inserted_id
                )
            )
        )

        return success(
            data=_serialize_louvor(
                louvor_criado
            ),
            message=(
                "Louvor cadastrado com sucesso."
            ),
            status=201
        )

    except AppError as e:
        return error(
            e.message,
            e.status
        )

    except Exception as e:
        logger.exception(
            "Erro ao cadastrar louvor"
        )

        return error(
            str(e),
            500
        )


def editar_louvor_service(
    louvor_id,
    data
):
    try:
        if not ObjectId.is_valid(
            louvor_id
        ):
            return error(
                "Identificador do louvor é inválido.",
                400
            )

        louvor_atual = (
            LouvoresRepository
            .buscar_por_id(
                louvor_id
            )
        )

        if not louvor_atual:
            return error(
                "Louvor não encontrado.",
                404
            )

        dados = LouvorSchema.validar(
            data
        )

        existente = (
            LouvoresRepository
            .buscar_por_nome(
                dados["louvor"]
            )
        )

        if (
            existente
            and str(
                existente["_id"]
            ) != louvor_id
        ):
            return error(
                "Já existe outro louvor com este nome.",
                409
            )

        LouvoresRepository.atualizar(
            louvor_id,
            dados
        )

        louvor_atualizado = (
            LouvoresRepository
            .buscar_por_id(
                louvor_id
            )
        )

        return success(
            data=_serialize_louvor(
                louvor_atualizado
            ),
            message=(
                "Louvor atualizado com sucesso."
            )
        )

    except AppError as e:
        return error(
            e.message,
            e.status
        )

    except Exception as e:
        logger.exception(
            "Erro ao editar louvor"
        )

        return error(
            str(e),
            500
        )


def excluir_louvor_service(
    louvor_id
):
    try:
        if not ObjectId.is_valid(
            louvor_id
        ):
            return error(
                "Identificador do louvor é inválido.",
                400
            )

        louvor = (
            LouvoresRepository
            .buscar_por_id(
                louvor_id
            )
        )

        if not louvor:
            return error(
                "Louvor não encontrado.",
                404
            )

        LouvoresRepository.excluir(
            louvor_id
        )

        return success(
            message=(
                "Louvor excluído com sucesso."
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao excluir louvor"
        )

        return error(
            str(e),
            500
        )