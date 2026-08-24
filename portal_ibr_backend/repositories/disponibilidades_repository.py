from database.mongo import db


class DisponibilidadesRepository:

    @staticmethod
    def listar(filtro=None):
        filtro = filtro or {}

        return db.disponibilidades.find(filtro)

    @staticmethod
    def buscar_por_integrante_e_ministerio(
        integrante_id,
        ministerio
    ):
        return db.disponibilidades.find_one({
            "integrante_id": integrante_id,
            "ministerio": ministerio
        })

    @staticmethod
    def salvar_ou_atualizar(
        integrante_id,
        ministerio,
        dados
    ):
        return db.disponibilidades.update_one(
            {
                "integrante_id": integrante_id,
                "ministerio": ministerio
            },
            {
                "$set": dados
            },
            upsert=True
        )

    @staticmethod
    def listar_disponiveis_por_data(
        data_id,
        ministerio
    ):
        return db.disponibilidades.find({
            "ministerio": ministerio,
            "disponibilidades": {
                "$elemMatch": {
                    "data_id": data_id,
                    "disponivel": True
                }
            }
        })

    @staticmethod
    def listar_por_ministerio(
        ministerio
    ):
        return db.disponibilidades.find({
            "ministerio": ministerio
        })