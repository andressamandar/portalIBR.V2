from utils.validators import campo_obrigatorio, lista_obrigatoria
from utils.exceptions import AppError


class IntegranteSchema:

    @staticmethod
    def validar(data):
        nome = data.get("nome", "").strip()
        ministerios = data.get("ministerios", [])
        funcoes = data.get("funcoes", [])
        perfil_ministro = data.get("perfil_ministro", False)

        if not campo_obrigatorio(nome):
            raise AppError("Nome é obrigatório.", 400)

        if not lista_obrigatoria(ministerios):
            raise AppError("Selecione pelo menos um ministério.", 400)

        if not lista_obrigatoria(funcoes):
            raise AppError("Selecione pelo menos uma função.", 400)

        return {
            "nome": nome,
            "ministerios": ministerios,
            "funcoes": funcoes,
            "perfil_ministro": perfil_ministro
        }