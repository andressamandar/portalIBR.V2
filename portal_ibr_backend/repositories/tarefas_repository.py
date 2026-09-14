from bson import ObjectId
from database.mongo import db


class TarefasRepository:

    @staticmethod
    def listar(filtro=None):
        if filtro is None:
            filtro = {}

        return db.tarefas.find(filtro).sort(
            "data_cadastro",
            -1
        )

    @staticmethod
    def buscar_por_id(id):
        return db.tarefas.find_one({
            "_id": ObjectId(id)
        })

    @staticmethod
    def cadastrar(documento):
        return db.tarefas.insert_one(
            documento
        )

    @staticmethod
    def atualizar(id, dados):
        return db.tarefas.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": dados
            }
        )

    @staticmethod
    def excluir(id):
        return db.tarefas.delete_one({
            "_id": ObjectId(id)
        })