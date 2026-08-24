from bson import ObjectId

from database.mongo import db


class DatasRepository:

    @staticmethod
    def listar(filtro):
        return db.datas_escala.find(
            filtro
        ).sort("data", 1)

    @staticmethod
    def buscar_por_id(id):
        return db.datas_escala.find_one({
            "_id": ObjectId(id)
        })

    @staticmethod
    def buscar_data_duplicada(
        ministerio,
        data_culto,
        id_atual=None
    ):
        filtro = {
            "ministerio": ministerio,
            "data": data_culto,
            "ativo": True
        }

        if id_atual:
            filtro["_id"] = {
                "$ne": ObjectId(id_atual)
            }

        return db.datas_escala.find_one(
            filtro
        )

    @staticmethod
    def cadastrar(documento):
        return db.datas_escala.insert_one(
            documento
        )

    @staticmethod
    def atualizar(id, dados):
        return db.datas_escala.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": dados
            }
        )

    @staticmethod
    def desativar(id):
        return db.datas_escala.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": {
                    "ativo": False
                }
            }
        )

    @staticmethod
    def marcar_escala_criada(id):
        return db.datas_escala.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": {
                    "escala_criada": True
                }
            }
        )