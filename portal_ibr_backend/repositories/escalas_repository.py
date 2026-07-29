from bson import ObjectId

from database.mongo import db


class EscalasRepository:

    @staticmethod
    def listar(filtro=None):
        filtro = filtro or {}

        return db.escalas.find(filtro).sort("data", 1)

    @staticmethod
    def buscar_por_id(escala_id):
        return db.escalas.find_one({
            "_id": ObjectId(escala_id)
        })

    @staticmethod
    def buscar_por_data_id(data_id, ministerio=None):
        filtro = {
            "data_id": data_id
        }

        if ministerio:
            filtro["ministerio"] = ministerio

        return db.escalas.find_one(filtro)

    @staticmethod
    def cadastrar(documento):
        return db.escalas.insert_one(documento)

    @staticmethod
    def atualizar(escala_id, dados):
        return db.escalas.update_one(
            {
                "_id": ObjectId(escala_id)
            },
            {
                "$set": dados
            }
        )

    @staticmethod
    def excluir(escala_id):
        return db.escalas.delete_one({
            "_id": ObjectId(escala_id)
        })

    @staticmethod
    def buscar_integrantes_por_ids(ids):
        object_ids = [
            ObjectId(integrante_id)
            for integrante_id in ids
            if ObjectId.is_valid(integrante_id)
        ]

        return list(
            db.integrantes.find({
                "_id": {
                    "$in": object_ids
                }
            })
        )

    @staticmethod
    def marcar_data_com_escala(data_id, escala_criada=True):
        return db.datas_escala.update_one(
            {
                "_id": ObjectId(data_id)
            },
            {
                "$set": {
                    "escala_criada": escala_criada
                }
            }
        )