from utils.validators import (
    campo_obrigatorio,
    lista_obrigatoria
)

from utils.exceptions import AppError


class SolicitacaoSchema:

    @staticmethod
    def validar(data):

        if not isinstance(
            data,
            dict
        ):
            raise AppError(
                "Dados da solicitação não informados.",
                400
            )

        ministerio = (
            data.get(
                "ministerio",
                ""
            )
            .strip()
        )

        solicitante = (
            data.get(
                "solicitante",
                ""
            )
            .strip()
        )

        celular = str(
            data.get(
                "celular",
                ""
            )
        ).strip()

        formatos_solicitados = (
            data.get(
                "formatos_solicitados",
                []
            )
        )

        descricao = (
            data.get(
                "descricao",
                ""
            )
            .strip()
        )

        sugestao_arte = (
            data.get(
                "sugestao_arte",
                ""
            )
            .strip()
        )

        data_evento = (
            data.get(
                "data_evento",
                ""
            )
            .strip()
        )

        horario_evento = (
            data.get(
                "horario_evento",
                ""
            )
            .strip()
        )

        data_entrega = (
            data.get(
                "data_entrega",
                ""
            )
            .strip()
        )


        if not campo_obrigatorio(
            ministerio
        ):
            raise AppError(
                "Ministério é obrigatório.",
                400
            )


        if not campo_obrigatorio(
            solicitante
        ):
            raise AppError(
                "Solicitante é obrigatório.",
                400
            )


        if not campo_obrigatorio(
            celular
        ):
            raise AppError(
                "Celular é obrigatório.",
                400
            )


        if not celular.isdigit():
            raise AppError(
                "Digite somente DDD + número do celular, "
                "sem caracteres.",
                400
            )


        if len(celular) not in [
            10,
            11
        ]:
            raise AppError(
                "Informe o celular com DDD e número.",
                400
            )


        if not lista_obrigatoria(
            formatos_solicitados
        ):
            raise AppError(
                "Selecione pelo menos um formato.",
                400
            )


        if not campo_obrigatorio(
            descricao
        ):
            raise AppError(
                "Descrição é obrigatória.",
                400
            )


        if not campo_obrigatorio(
            data_evento
        ):
            raise AppError(
                "Data do evento é obrigatória.",
                400
            )


        if not campo_obrigatorio(
            horario_evento
        ):
            raise AppError(
                "Horário do evento é obrigatório.",
                400
            )


        if not campo_obrigatorio(
            data_entrega
        ):
            raise AppError(
                "Data de entrega é obrigatória.",
                400
            )


        return {
            "ministerio":
                ministerio,

            "solicitante":
                solicitante,

            "celular":
                celular,

            "formatos_solicitados":
                formatos_solicitados,

            "descricao":
                descricao,

            "sugestao_arte":
                sugestao_arte,

            "data_evento":
                data_evento,

            "horario_evento":
                horario_evento,

            "data_entrega":
                data_entrega
        }