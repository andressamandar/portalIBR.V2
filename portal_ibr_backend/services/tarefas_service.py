from datetime import datetime

from repositories.tarefas_repository import TarefasRepository
from schemas.tarefa_schema import TarefaSchema
from utils.responses import success, error
from utils.exceptions import AppError
from utils.logger import logger


STATUS_A_FAZER = "A Fazer"
STATUS_FAZENDO = "Fazendo"
STATUS_CONCLUIDO = "Concluído"


def serializar_tarefa(tarefa):
    return {
        "_id": str(tarefa["_id"]),

        "ministerio":
            tarefa.get(
                "ministerio",
                ""
            ),

        "solicitante":
            tarefa.get(
                "solicitante",
                ""
            ),

        "formatos_solicitados":
            tarefa.get(
                "formatos_solicitados",
                []
            ),

        "descricao":
            tarefa.get(
                "descricao",
                ""
            ),

        "sugestao_arte":
            tarefa.get(
                "sugestao_arte",
                ""
            ),

        "data_evento":
            tarefa.get(
                "data_evento",
                ""
            ),

        "horario_evento":
            tarefa.get(
                "horario_evento",
                ""
            ),

        "data_entrega":
            tarefa.get(
                "data_entrega",
                ""
            ),

        "status":
            tarefa.get(
                "status",
                STATUS_A_FAZER
            ),

        "responsavel_id":
            tarefa.get(
                "responsavel_id"
            ),

        "responsavel_nome":
            tarefa.get(
                "responsavel_nome"
            ),

        "data_cadastro": (
            tarefa.get(
                "data_cadastro"
            ).isoformat()
            if tarefa.get(
                "data_cadastro"
            )
            else None
        )
    }


def listar_tarefas_service():
    try:
        tarefas = [
            serializar_tarefa(
                tarefa
            )
            for tarefa
            in TarefasRepository.listar()
        ]

        return success(
            data=tarefas,
            total=len(tarefas)
        )

    except Exception as e:
        logger.exception(
            "Erro ao listar tarefas"
        )

        return error(
            str(e),
            500
        )


def buscar_tarefa_service(id):
    try:
        tarefa = (
            TarefasRepository.buscar_por_id(
                id
            )
        )

        if not tarefa:
            return error(
                "Tarefa não encontrada.",
                404
            )

        return success(
            data=serializar_tarefa(
                tarefa
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao buscar tarefa"
        )

        return error(
            str(e),
            500
        )


def cadastrar_tarefa_service(data):
    try:
        dados = TarefaSchema.validar(
            data
        )

        documento = {
            **dados,

            "status":
                STATUS_A_FAZER,

            "responsavel_id":
                None,

            "responsavel_nome":
                None,

            "data_cadastro":
                datetime.utcnow()
        }

        resultado = (
            TarefasRepository.cadastrar(
                documento
            )
        )

        return success(
            data={
                "id":
                    str(
                        resultado.inserted_id
                    )
            },
            message=(
                "Tarefa cadastrada "
                "com sucesso."
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
            "Erro ao cadastrar tarefa"
        )

        return error(
            str(e),
            500
        )


def editar_tarefa_service(
    id,
    data
):
    try:
        tarefa = (
            TarefasRepository.buscar_por_id(
                id
            )
        )

        if not tarefa:
            return error(
                "Tarefa não encontrada.",
                404
            )

        dados = TarefaSchema.validar(
            data
        )

        TarefasRepository.atualizar(
            id,
            dados
        )

        return success(
            message=(
                "Tarefa atualizada "
                "com sucesso."
            )
        )

    except AppError as e:
        return error(
            e.message,
            e.status
        )

    except Exception as e:
        logger.exception(
            "Erro ao editar tarefa"
        )

        return error(
            str(e),
            500
        )


def excluir_tarefa_service(id):
    try:
        tarefa = (
            TarefasRepository.buscar_por_id(
                id
            )
        )

        if not tarefa:
            return error(
                "Tarefa não encontrada.",
                404
            )

        TarefasRepository.excluir(
            id
        )

        return success(
            message=(
                "Tarefa excluída "
                "com sucesso."
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao excluir tarefa"
        )

        return error(
            str(e),
            500
        )


def assumir_tarefa_service(
    id,
    usuario
):
    try:
        tarefa = (
            TarefasRepository.buscar_por_id(
                id
            )
        )

        if not tarefa:
            return error(
                "Tarefa não encontrada.",
                404
            )

        if (
            tarefa.get("status")
            != STATUS_A_FAZER
        ):
            return error(
                "Esta tarefa não está "
                "disponível para ser assumida.",
                400
            )

        integrante_id = usuario.get(
            "id"
        )

        integrante_nome = usuario.get(
            "nome"
        )

        if (
            not integrante_id
            or not integrante_nome
        ):
            return error(
                "Não foi possível identificar "
                "o integrante logado.",
                400
            )

        dados = {
            "status":
                STATUS_FAZENDO,

            "responsavel_id":
                integrante_id,

            "responsavel_nome":
                integrante_nome
        }

        TarefasRepository.atualizar(
            id,
            dados
        )

        return success(
            message=(
                "Tarefa assumida "
                "com sucesso."
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao assumir tarefa"
        )

        return error(
            str(e),
            500
        )


def concluir_tarefa_service(
    id,
    usuario
):
    try:
        tarefa = (
            TarefasRepository.buscar_por_id(
                id
            )
        )

        if not tarefa:
            return error(
                "Tarefa não encontrada.",
                404
            )

        if (
            tarefa.get("status")
            != STATUS_FAZENDO
        ):
            return error(
                "Esta tarefa não está "
                "em andamento.",
                400
            )

        integrante_id = usuario.get(
            "id"
        )

        if (
            tarefa.get(
                "responsavel_id"
            )
            != integrante_id
        ):
            return error(
                "Somente o responsável "
                "pela tarefa pode concluí-la.",
                403
            )

        TarefasRepository.atualizar(
            id,
            {
                "status":
                    STATUS_CONCLUIDO
            }
        )

        return success(
            message=(
                "Tarefa concluída "
                "com sucesso."
            )
        )

    except Exception as e:
        logger.exception(
            "Erro ao concluir tarefa"
        )

        return error(
            str(e),
            500
        )