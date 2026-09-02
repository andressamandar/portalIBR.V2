from utils.exceptions import AppError


class LouvorSchema:

    CATEGORIAS_VALIDAS = [
        "Agitado",
        "Calmo"
    ]

    @staticmethod
    def validar(data):
        if not isinstance(data, dict):
            raise AppError(
                "Dados do louvor não informados.",
                400
            )

        louvor = str(
            data.get("louvor", "")
        ).strip()

        link = str(
            data.get("link", "")
        ).strip()

        tom = str(
            data.get("tom", "")
        ).strip()

        categoria = str(
            data.get("categoria", "")
        ).strip()

        if not louvor:
            raise AppError(
                "Nome do louvor é obrigatório.",
                400
            )

        if not categoria:
            raise AppError(
                "Categoria do louvor é obrigatória.",
                400
            )

        if (
            categoria
            not in LouvorSchema.CATEGORIAS_VALIDAS
        ):
            raise AppError(
                "Categoria do louvor inválida.",
                400
            )

        return {
            "louvor": louvor,
            "link": link,
            "tom": tom,
            "categoria": categoria
        }