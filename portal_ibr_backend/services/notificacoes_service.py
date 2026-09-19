from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from repositories.notificacoes_repository import (NotificacoesRepository)
from utils.exceptions import AppError


class NotificacoesService:

    TIPOS = {
        "disponibilidade_salva",
        "disponibilidade_alterada",
        "escala_criada",
        "escala_alterada",
        "louvores_definidos",
        "louvores_alterados",
        "solicitacao_nova",
        "solicitacao_editada"
    }


    @staticmethod
    def _obter_expiracao():
        fuso_brasilia = ZoneInfo(
            "America/Sao_Paulo"
        )

        agora = datetime.now(
            fuso_brasilia
        )

        if agora.month == 12:
            inicio_proximo_mes = datetime(
                agora.year + 1,
                1,
                1,
                tzinfo=fuso_brasilia
            )

        else:
            inicio_proximo_mes = datetime(
                agora.year,
                agora.month + 1,
                1,
                tzinfo=fuso_brasilia
            )

        return inicio_proximo_mes.astimezone(
            timezone.utc
        )

    @staticmethod
    def serializar(notificacao):
        if not notificacao:
            return None

        data_cadastro = (
            notificacao.get(
                "data_cadastro"
            )
        )

        expira_em = (
            notificacao.get(
                "expira_em"
            )
        )

        return {
            "_id": str(
                notificacao["_id"]
            ),
            "tipo": notificacao.get(
                "tipo"
            ),
            "titulo": notificacao.get(
                "titulo"
            ),
            "mensagem": notificacao.get(
                "mensagem"
            ),
            "ministerio": notificacao.get(
                "ministerio"
            ),
            "destinatario_perfil": (
                notificacao.get(
                    "destinatario_perfil"
                )
            ),
            "destinatario_id": (
                notificacao.get(
                    "destinatario_id"
                )
            ),
            "referencia_tipo": (
                notificacao.get(
                    "referencia_tipo"
                )
            ),
            "referencia_id": (
                notificacao.get(
                    "referencia_id"
                )
            ),
            "lida": notificacao.get(
                "lida",
                False
            ),
            "data_cadastro": (
                data_cadastro.isoformat()
                if data_cadastro
                else None
            ),
            "expira_em": (
                expira_em.isoformat()
                if expira_em
                else None
            )
        }


    @staticmethod
    def criar(
        tipo,
        titulo,
        mensagem,
        ministerio,
        destinatario_perfil,
        destinatario_id=None,
        referencia_tipo=None,
        referencia_id=None
    ):
        if (
            tipo
            not in NotificacoesService.TIPOS
        ):
            raise AppError(
                "Tipo de notificação inválido.",
                400
            )

        if not titulo:
            raise AppError(
                "Título da notificação é obrigatório.",
                400
            )

        if not mensagem:
            raise AppError(
                "Mensagem da notificação é obrigatória.",
                400
            )

        if not destinatario_perfil:
            raise AppError(
                "Destinatário da notificação é obrigatório.",
                400
            )

        agora = datetime.now(
            timezone.utc
        )

        documento = {
            "tipo": tipo,
            "titulo": titulo,
            "mensagem": mensagem,
            "ministerio": ministerio,
            "destinatario_perfil": (
                destinatario_perfil
            ),
            "destinatario_id": (
                str(destinatario_id)
                if destinatario_id
                else None
            ),
            "referencia_tipo": (
                referencia_tipo
            ),
            "referencia_id": (
                str(referencia_id)
                if referencia_id
                else None
            ),
            "lida": False,
            "data_cadastro": agora,
            "expira_em": (
                NotificacoesService
                ._obter_expiracao()
            )
        }

        resultado = (
            NotificacoesRepository
            .cadastrar(
                documento
            )
        )

        documento["_id"] = (
            resultado.inserted_id
        )

        return documento


    @staticmethod
    def listar(
        destinatario_perfil,
        destinatario_id=None
    ):
        filtro = {
            "destinatario_perfil": (
                destinatario_perfil
            )
        }

        if destinatario_id:
            filtro["$or"] = [
                {
                    "destinatario_id": (
                        str(
                            destinatario_id
                        )
                    )
                },
                {
                    "destinatario_id": None
                }
            ]

        else:
            filtro[
                "destinatario_id"
            ] = None

        documentos = (
            NotificacoesRepository
            .listar(
                filtro
            )
        )

        return [
            NotificacoesService
            .serializar(
                documento
            )
            for documento
            in documentos
        ]


    @staticmethod
    def contar_nao_lidas(
        destinatario_perfil,
        destinatario_id=None
    ):
        notificacoes = (
            NotificacoesService
            .listar(
                destinatario_perfil,
                destinatario_id
            )
        )

        return len(
            [
                notificacao
                for notificacao
                in notificacoes
                if not notificacao[
                    "lida"
                ]
            ]
        )


    @staticmethod
    def pertence_ao_destinatario(
        notificacao,
        destinatario_perfil,
        destinatario_id=None
    ):
        if (
            notificacao.get(
                "destinatario_perfil"
            )
            !=
            destinatario_perfil
        ):
            return False

        notificacao_destinatario_id = (
            notificacao.get(
                "destinatario_id"
            )
        )

        if (
            notificacao_destinatario_id
            is None
        ):
            return True

        if destinatario_id is None:
            return False

        return (
            str(
                notificacao_destinatario_id
            )
            ==
            str(
                destinatario_id
            )
        )


    @staticmethod
    def marcar_como_lida(
        id,
        destinatario_perfil,
        destinatario_id=None
    ):
        try:
            notificacao = (
                NotificacoesRepository
                .buscar_por_id(
                    id
                )
            )

        except Exception:
            raise AppError(
                "Notificação inválida.",
                400
            )

        if not notificacao:
            raise AppError(
                "Notificação não encontrada.",
                404
            )

        pertence = (
            NotificacoesService
            .pertence_ao_destinatario(
                notificacao,
                destinatario_perfil,
                destinatario_id
            )
        )

        if not pertence:
            raise AppError(
                (
                    "Você não possui acesso "
                    "a esta notificação."
                ),
                403
            )

        (
            NotificacoesRepository
            .marcar_como_lida(
                id
            )
        )

        notificacao["lida"] = True

        return (
            NotificacoesService
            .serializar(
                notificacao
            )
        )


    @staticmethod
    def marcar_todas_como_lidas(
        destinatario_perfil,
        destinatario_id=None
    ):
        filtro = {
            "destinatario_perfil": (
                destinatario_perfil
            )
        }

        if destinatario_id:
            filtro["$or"] = [
                {
                    "destinatario_id": (
                        str(
                            destinatario_id
                        )
                    )
                },
                {
                    "destinatario_id": None
                }
            ]

        else:
            filtro[
                "destinatario_id"
            ] = None

        (
            NotificacoesRepository
            .marcar_todas_como_lidas(
                filtro
            )
        )

        return True