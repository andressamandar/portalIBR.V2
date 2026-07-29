from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from database.mongo import db

disponibilidades_bp = Blueprint(
    "disponibilidades",
    __name__,
    url_prefix="/api/disponibilidades"
)

@disponibilidades_bp.route("/datas-disponiveis", methods=["GET"])
def listar_datas_disponiveis():

    ministerio = request.args.get("ministerio")

    filtro = {
        "ministerio": ministerio,
        "ativo": True,
        "escala_criada": False
    }

    datas = []

    for d in db.datas_escala.find(filtro).sort("data", 1):

        datas.append({
            "_id": str(d["_id"]),
            "data": d["data"],
            "tipo": d["tipo"],
            "nome_evento": d.get("nome_evento")
        })

    return jsonify({
        "success": True,
        "data": datas
    })
    
@disponibilidades_bp.route("", methods=["POST"])    
def salvar_disponibilidade():

    data = request.get_json()

    integrante_id = data.get("integrante_id")
    integrante_nome = data.get("integrante_nome")
    ministerio = data.get("ministerio")
    disponibilidades = data.get("disponibilidades", [])

    if not integrante_id:
        return jsonify({
            "success": False,
            "message": "Integrante obrigatório."
        }), 400

    db.disponibilidades.update_one(
        {
            "integrante_id": integrante_id,
            "ministerio": ministerio
        },
        {
            "$set": {
                "integrante_nome": integrante_nome,
                "ministerio": ministerio,
                "disponibilidades": disponibilidades,
                "data_preenchimento": datetime.utcnow()
            }
        },
        upsert=True
    )

    return jsonify({
        "success": True,
        "message": "Disponibilidade salva com sucesso."
    })
    
@disponibilidades_bp.route("/integrante/<integrante_id>", methods=["GET"])
def buscar_disponibilidade(integrante_id):

    doc = db.disponibilidades.find_one({
        "integrante_id": integrante_id
    })

    if not doc:

        return jsonify({
            "success": True,
            "data": []
        })

    doc["_id"] = str(doc["_id"])

    return jsonify({
        "success": True,
        "data": doc
    })
    
@disponibilidades_bp.route("/preenchimento", methods=["GET"])
def visualizar_preenchimento():

    ministerio = request.args.get("ministerio")

    integrantes = list(
        db.integrantes.find({
            "ministerios": ministerio,
            "ativo": True
        })
    )

    resposta = []

    for integrante in integrantes:

        preenchido = db.disponibilidades.find_one({
            "integrante_id": str(integrante["_id"]),
            "ministerio": ministerio
        })

        resposta.append({
            "nome": integrante["nome"],
            "preencheu": preenchido is not None
        })

    return jsonify({
        "success": True,
        "data": resposta
    })
    
@disponibilidades_bp.route("/limitadas", methods=["GET"])
def disponibilidades_limitadas():

    ministerio = request.args.get("ministerio")

    resultado = []

    docs = db.disponibilidades.find({
        "ministerio": ministerio
    })

    for doc in docs:

        disponiveis = [
            d["data"]
            for d in doc["disponibilidades"]
            if d["disponivel"]
        ]

        if len(disponiveis) <= 1:

            resultado.append({
                "nome": doc["integrante_nome"],
                "datas": disponiveis
            })

    return jsonify({
        "success": True,
        "data": resultado
    })