def campo_obrigatorio(valor):
    return valor is not None and str(valor).strip() != ""


def lista_obrigatoria(valor):
    return isinstance(valor, list) and len(valor) > 0