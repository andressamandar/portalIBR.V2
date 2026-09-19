from bson import ObjectId

from database.mongo import db


class NotificacoesRepository:

    _indice_ttl_garantido = False


    @staticmethod
    def garantir_indice_ttl():
        if (
            NotificacoesRepository
            ._indice_ttl_garantido
        ):
            return

        db.notificacoes.create_index(
            "expira_em",
            expireAfterSeconds=0,
            name="notificacoes_expiracao_ttl"
        )

        (
            NotificacoesRepository
            ._indice_ttl_garantido
        ) = True


    @staticmethod
    def listar(filtro=None):
        if filtro is None:
            filtro = {}

        return (
            db.notificacoes
            .find(filtro)
            .sort("data_cadastro", -1)
        )


    @staticmethod
    def buscar_por_id(id):
        return db.notificacoes.find_one(
            {
                "_id": ObjectId(id)
            }
        )


    @staticmethod
    def cadastrar(documento):

        (
            NotificacoesRepository
            .garantir_indice_ttl()
        )

        return db.notificacoes.insert_one(
            documento
        )


    @staticmethod
    def marcar_como_lida(id):
        return db.notificacoes.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": {
                    "lida": True
                }
            }
        )


    @staticmethod
    def marcar_todas_como_lidas(
        filtro
    ):
        return db.notificacoes.update_many(
            filtro,
            {
                "$set": {
                    "lida": True
                }
            }
        )


    @staticmethod
    def excluir(id):
        return db.notificacoes.delete_one(
            {
                "_id": ObjectId(id)
            }
        )