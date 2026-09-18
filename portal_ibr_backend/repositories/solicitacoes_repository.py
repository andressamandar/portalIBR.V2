from bson import ObjectId

from database.mongo import db


class SolicitacoesRepository:

    @staticmethod
    def listar(
        filtro=None
    ):
        if filtro is None:
            filtro = {}

        return (
            db.solicitacoes
            .find(
                filtro
            )
            .sort(
                "data_cadastro",
                -1
            )
        )


    @staticmethod
    def buscar_por_id(
        id
    ):
        return (
            db.solicitacoes
            .find_one(
                {
                    "_id":
                        ObjectId(
                            id
                        )
                }
            )
        )


    @staticmethod
    def cadastrar(
        documento
    ):
        return (
            db.solicitacoes
            .insert_one(
                documento
            )
        )


    @staticmethod
    def atualizar(
        id,
        dados
    ):
        return (
            db.solicitacoes
            .update_one(
                {
                    "_id":
                        ObjectId(
                            id
                        )
                },
                {
                    "$set":
                        dados
                }
            )
        )


    @staticmethod
    def excluir(
        id
    ):
        return (
            db.solicitacoes
            .delete_one(
                {
                    "_id":
                        ObjectId(
                            id
                        )
                }
            )
        )