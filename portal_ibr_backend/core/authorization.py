def usuario_esta_na_funcao(
    escala,
    usuario_id,
    funcao
):
    funcoes = escala.get("funcoes", {})
    integrantes_ids = funcoes.get(funcao, [])

    return usuario_id in integrantes_ids


def pode_editar_louvores(
    usuario,
    escala
):
    if usuario.get("perfil") == "lideranca_louvor":
        return True

    if usuario.get("perfil") != "integrante_louvor":
        return False

    return usuario_esta_na_funcao(
        escala=escala,
        usuario_id=usuario.get("id"),
        funcao="Ministração"
    )