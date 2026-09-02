from bson import ObjectId

from utils.exceptions import AppError


class LouvorEscalaSchema:

    @staticmethod
    def validar(data):
        if not isinstance(data, dict):
            raise AppError(
                "Dados dos louvores da escala não informados.",
                400
            )

        ministerio = str(
            data.get("ministerio", "")
        ).strip()

        data_id = str(
            data.get("data_id", "")
        ).strip()

        louvores = data.get(
            "louvores",
            []
        )

        if not ministerio:
            raise AppError(
                "Ministério é obrigatório.",
                400
            )

        if ministerio not in [
            "Louvor",
            "Midia"
        ]:
            raise AppError(
                "Ministério inválido.",
                400
            )

        if not data_id:
            raise AppError(
                "Data é obrigatória.",
                400
            )

        if not ObjectId.is_valid(
            data_id
        ):
            raise AppError(
                "Identificador da data é inválido.",
                400
            )

        if not isinstance(
            louvores,
            list
        ):
            raise AppError(
                "Louvores devem ser uma lista.",
                400
            )

        louvores_normalizados = []

        ids_adicionados = set()

        for item in louvores:

            if not isinstance(
                item,
                dict
            ):
                raise AppError(
                    "Louvor da escala inválido.",
                    400
                )

            louvor_id = str(
                item.get(
                    "louvor_id",
                    ""
                )
            ).strip()

            tom = str(
                item.get(
                    "tom",
                    ""
                )
            ).strip()

            if not louvor_id:
                raise AppError(
                    "Louvor é obrigatório.",
                    400
                )

            if not ObjectId.is_valid(
                louvor_id
            ):
                raise AppError(
                    "Identificador do louvor é inválido.",
                    400
                )

            if louvor_id in ids_adicionados:
                continue

            ids_adicionados.add(
                louvor_id
            )

            louvores_normalizados.append({
                "louvor_id":
                    louvor_id,
                "tom":
                    tom
            })

        return {
            "ministerio":
                ministerio,
            "data_id":
                data_id,
            "louvores":
                louvores_normalizados
        }