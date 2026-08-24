from flask import Blueprint, request, jsonify

from database.mongo import db

from services.disponibilidades_service import (
    buscar_disponibilidade_integrante_service,
    listar_disponiveis_por_data_service,
    salvar_disponibilidade_service
)


disponibilidades_bp = Blueprint(
    "disponibilidades",
    __name__,
    url_prefix="/api/disponibilidades"
)


@disponibilidades_bp.route(
    "/datas-disponiveis",
    methods=["GET"]
)
def listar_datas_disponiveis():

    ministerio = request.args.get("ministerio")

    filtro = {
        "ministerio": ministerio,
        "ativo": True,
        "escala_criada": False
    }

    datas = []

    for d in db.datas_escala.find(
        filtro
    ).sort("data", 1):

        datas.append({
            "_id": str(d["_id"]),
            "data": d["data"],
            "tipo": d["tipo"],
            "nome_evento": d.get(
                "nome_evento"
            )
        })

    return jsonify({
        "success": True,
        "data": datas
    })


@disponibilidades_bp.route(
    "",
    methods=["POST"]
)
def salvar_disponibilidade():

    return salvar_disponibilidade_service(
        request.get_json(silent=True) or {}
    )


@disponibilidades_bp.route(
    "/integrante/<integrante_id>",
    methods=["GET"]
)
def buscar_disponibilidade(
    integrante_id
):

    return (
        buscar_disponibilidade_integrante_service(
            integrante_id=integrante_id,
            ministerio=request.args.get(
                "ministerio"
            )
        )
    )


@disponibilidades_bp.route(
    "/data/<data_id>/disponiveis",
    methods=["GET"]
)
def listar_disponiveis_por_data(
    data_id
):

    return listar_disponiveis_por_data_service(
        data_id=data_id,
        ministerio=request.args.get(
            "ministerio"
        )
    )


@disponibilidades_bp.route(
    "/preenchimento",
    methods=["GET"]
)
def visualizar_preenchimento():

    ministerio = request.args.get(
        "ministerio"
    )

    integrantes = list(
        db.integrantes.find({
            "ministerios": ministerio,
            "ativo": True
        })
    )

    resposta = []

    for integrante in integrantes:

        preenchido = (
            db.disponibilidades.find_one({
                "integrante_id": str(
                    integrante["_id"]
                ),
                "ministerio": ministerio
            })
        )

        resposta.append({
            "nome": integrante["nome"],
            "preencheu":
                preenchido is not None
        })

    return jsonify({
        "success": True,
        "data": resposta
    })


@disponibilidades_bp.route(
    "/limitadas",
    methods=["GET"]
)
def disponibilidades_limitadas():

    ministerio = request.args.get(
        "ministerio"
    )

    resultado = []

    docs = db.disponibilidades.find({
        "ministerio": ministerio
    })

    for doc in docs:

        disponiveis = [
            d["data"]
            for d in doc.get(
                "disponibilidades",
                []
            )
            if d.get("disponivel")
        ]

        if len(disponiveis) <= 1:

            resultado.append({
                "nome": doc.get(
                    "integrante_nome"
                ),
                "datas": disponiveis
            })

    return jsonify({
        "success": True,
        "data": resultado
    })