from bson import ObjectId

from database.mongo import db


class LouvoresEscalaRepository:

    @staticmethod
    def buscar_por_data(
        data_id,
        ministerio
    ):
        return db.louvores_escala.find_one({
            "data_id": data_id,
            "ministerio": ministerio
        })

    @staticmethod
    def salvar_ou_atualizar(
        data_id,
        ministerio,
        dados
    ):
        return db.louvores_escala.update_one(
            {
                "data_id": data_id,
                "ministerio": ministerio
            },
            {
                "$set": dados
            },
            upsert=True
        )

    @staticmethod
    def listar(
        filtro=None
    ):
        filtro = filtro or {}

        return db.louvores_escala.find(
            filtro
        )

    @staticmethod
    def buscar_louvores_por_ids(
        ids
    ):
        object_ids = [
            ObjectId(louvor_id)
            for louvor_id in ids
            if ObjectId.is_valid(
                louvor_id
            )
        ]

        return list(
            db.louvores.find({
                "_id": {
                    "$in": object_ids
                }
            })
        )