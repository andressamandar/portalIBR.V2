from utils.exceptions import AppError


class DataSchema:

    TIPOS_VALIDOS = [
        "Domingo",
        "Quinta",
        "Outros"
    ]

    MINISTERIOS_VALIDOS = [
        "Louvor",
        "Midia"
    ]

    @staticmethod
    def validar(data):
        ministerio = data.get("ministerio", "").strip()
        data_culto = data.get("data", "").strip()
        tipo = data.get("tipo", "").strip()

        nome_evento = data.get("nome_evento")

        if isinstance(nome_evento, str):
            nome_evento = nome_evento.strip()

        if not ministerio:
            raise AppError(
                "Ministério é obrigatório.",
                400
            )

        if ministerio not in DataSchema.MINISTERIOS_VALIDOS:
            raise AppError(
                "Ministério inválido.",
                400
            )

        if not data_culto:
            raise AppError(
                "Data é obrigatória.",
                400
            )

        if not tipo:
            raise AppError(
                "Tipo é obrigatório.",
                400
            )

        if tipo not in DataSchema.TIPOS_VALIDOS:
            raise AppError(
                "Tipo inválido.",
                400
            )

        if tipo == "Outros" and not nome_evento:
            raise AppError(
                "Nome do evento é obrigatório.",
                400
            )

        return {
            "ministerio": ministerio,
            "data": data_culto,
            "tipo": tipo,
            "nome_evento": (
                nome_evento
                if tipo == "Outros"
                else None
            )
        }