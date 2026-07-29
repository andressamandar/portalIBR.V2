from bson import ObjectId

from utils.exceptions import AppError


class EscalaSchema:

    @staticmethod
    def validar(data):
        if not isinstance(data, dict):
            raise AppError("Dados da escala não informados.", 400)

        ministerio = str(data.get("ministerio", "")).strip()
        data_id = str(data.get("data_id", "")).strip()
        data_escala = str(data.get("data", "")).strip()
        funcoes = data.get("funcoes", {})

        if not ministerio:
            raise AppError("Ministério é obrigatório.", 400)

        if not data_id:
            raise AppError("Data da escala é obrigatória.", 400)

        if not ObjectId.is_valid(data_id):
            raise AppError("Identificador da data é inválido.", 400)

        if not data_escala:
            raise AppError("Data é obrigatória.", 400)

        if not isinstance(funcoes, dict):
            raise AppError("As funções da escala são inválidas.", 400)

        funcoes_normalizadas = {}

        for nome_funcao, integrantes_ids in funcoes.items():
            nome_funcao = str(nome_funcao).strip()

            if not nome_funcao:
                continue

            if integrantes_ids is None:
                integrantes_ids = []

            if not isinstance(integrantes_ids, list):
                raise AppError(
                    f"A função '{nome_funcao}' deve possuir uma lista de integrantes.",
                    400
                )

            ids_validos = []

            for integrante_id in integrantes_ids:
                integrante_id = str(integrante_id).strip()

                if not ObjectId.is_valid(integrante_id):
                    raise AppError(
                        f"Integrante inválido na função '{nome_funcao}'.",
                        400
                    )

                if integrante_id not in ids_validos:
                    ids_validos.append(integrante_id)

            funcoes_normalizadas[nome_funcao] = ids_validos

        return {
            "ministerio": ministerio,
            "data_id": data_id,
            "data": data_escala,
            "funcoes": funcoes_normalizadas
        }