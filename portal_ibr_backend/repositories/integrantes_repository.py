from bson import ObjectId
from database.mongo import db


class IntegrantesRepository:

    @staticmethod
    def listar(filtro):
        return db.integrantes.find(filtro).sort("nome", 1)

    @staticmethod
    def buscar_por_id(id):
        return db.integrantes.find_one({
            "_id": ObjectId(id)
        })

    @staticmethod
    def buscar_por_nome(nome):
        return db.integrantes.find_one({
            "nome": {
                "$regex": f"^{nome}$",
                "$options": "i"
            }
        })

    @staticmethod
    def buscar_nome_duplicado(nome, id_atual):
        return db.integrantes.find_one({
            "nome": {
                "$regex": f"^{nome}$",
                "$options": "i"
            },
            "_id": {
                "$ne": ObjectId(id_atual)
            }
        })

    @staticmethod
    def cadastrar(documento):
        return db.integrantes.insert_one(documento)

    @staticmethod
    def atualizar(id, dados):
        return db.integrantes.update_one(
            {"_id": ObjectId(id)},
            {"$set": dados}
        )

    @staticmethod
    def desativar(id):
        return db.integrantes.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"ativo": False}}
        )

    @staticmethod
    def reativar(id):
        return db.integrantes.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"ativo": True}}
        )