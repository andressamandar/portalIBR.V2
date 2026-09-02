from bson import ObjectId

from database.mongo import db


class LouvoresRepository:

    @staticmethod
    def listar():
        return db.louvores.find().sort(
            "louvor",
            1
        )

    @staticmethod
    def buscar_por_id(
        louvor_id
    ):
        return db.louvores.find_one({
            "_id": ObjectId(louvor_id)
        })

    @staticmethod
    def buscar_por_nome(
        nome
    ):
        return db.louvores.find_one({
            "louvor": {
                "$regex": f"^{nome}$",
                "$options": "i"
            }
        })

    @staticmethod
    def cadastrar(
        documento
    ):
        return db.louvores.insert_one(
            documento
        )

    @staticmethod
    def atualizar(
        louvor_id,
        dados
    ):
        return db.louvores.update_one(
            {
                "_id": ObjectId(
                    louvor_id
                )
            },
            {
                "$set": dados
            }
        )

    @staticmethod
    def excluir(
        louvor_id
    ):
        return db.louvores.delete_one({
            "_id": ObjectId(
                louvor_id
            )
        })