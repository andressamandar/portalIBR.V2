def serialize_datetime(valor):
    return valor.isoformat() if valor else None


def serialize_integrante(doc):
    return {
        "_id": str(doc["_id"]),
        "nome": doc.get("nome"),
        "ministerios": doc.get("ministerios", []),
        "funcoes": doc.get("funcoes", []),
        "perfil_ministro": doc.get("perfil_ministro", False),
        "ativo": doc.get("ativo", True),
        "data_cadastro": serialize_datetime(doc.get("data_cadastro"))
    }
    
def serialize_integrante_resumido(doc):
    return {
        "id": str(doc["_id"]),
        "nome": doc.get("nome"),
        "ativo": doc.get("ativo", True)
    }


def serialize_escala(doc, integrantes_por_id=None):
    integrantes_por_id = integrantes_por_id or {}

    funcoes_enriquecidas = {}

    for nome_funcao, integrantes_ids in doc.get("funcoes", {}).items():
        pessoas = []

        for integrante_id in integrantes_ids:
            integrante = integrantes_por_id.get(integrante_id)

            if integrante:
                pessoas.append(
                    serialize_integrante_resumido(integrante)
                )
            else:
                pessoas.append({
                    "id": integrante_id,
                    "nome": "Integrante não encontrado",
                    "ativo": False
                })

        funcoes_enriquecidas[nome_funcao] = pessoas

    return {
        "_id": str(doc["_id"]),
        "ministerio": doc.get("ministerio"),
        "data_id": doc.get("data_id"),
        "data": doc.get("data"),
        "funcoes": funcoes_enriquecidas,
        "data_criacao": serialize_datetime(
            doc.get("data_criacao")
        ),
        "ultima_atualizacao": serialize_datetime(
            doc.get("ultima_atualizacao")
        )
    }