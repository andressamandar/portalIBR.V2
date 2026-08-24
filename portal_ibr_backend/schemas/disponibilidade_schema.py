from bson import ObjectId

from utils.exceptions import AppError


class DisponibilidadeSchema:

    @staticmethod
    def validar(data):
        if not isinstance(data, dict):
            raise AppError(
                "Dados da disponibilidade não informados.",
                400
            )

        integrante_id = str(
            data.get("integrante_id", "")
        ).strip()

        integrante_nome = str(
            data.get("integrante_nome", "")
        ).strip()

        ministerio = str(
            data.get("ministerio", "")
        ).strip()

        disponibilidades = data.get(
            "disponibilidades",
            []
        )

        if not integrante_id:
            raise AppError(
                "Integrante é obrigatório.",
                400
            )

        if not ObjectId.is_valid(integrante_id):
            raise AppError(
                "Identificador do integrante é inválido.",
                400
            )

        if not integrante_nome:
            raise AppError(
                "Nome do integrante é obrigatório.",
                400
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

        if not isinstance(
            disponibilidades,
            list
        ):
            raise AppError(
                "Disponibilidades devem ser uma lista.",
                400
            )

        disponibilidades_normalizadas = []

        for item in disponibilidades:
            if not isinstance(item, dict):
                raise AppError(
                    "Disponibilidade inválida.",
                    400
                )

            data_id = str(
                item.get("data_id", "")
            ).strip()

            data_culto = str(
                item.get("data", "")
            ).strip()

            disponivel = item.get(
                "disponivel"
            )

            if not data_id:
                raise AppError(
                    "Identificador da data é obrigatório.",
                    400
                )

            if not ObjectId.is_valid(data_id):
                raise AppError(
                    "Identificador da data é inválido.",
                    400
                )

            if not data_culto:
                raise AppError(
                    "Data é obrigatória.",
                    400
                )

            if not isinstance(
                disponivel,
                bool
            ):
                raise AppError(
                    "Disponibilidade deve ser verdadeira ou falsa.",
                    400
                )

            disponibilidades_normalizadas.append({
                "data_id": data_id,
                "data": data_culto,
                "disponivel": disponivel
            })

        return {
            "integrante_id": integrante_id,
            "integrante_nome": integrante_nome,
            "ministerio": ministerio,
            "disponibilidades":
                disponibilidades_normalizadas
        }