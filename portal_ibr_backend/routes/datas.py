from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from database.mongo import db

datas_bp = Blueprint(
    "datas",
    __name__,
    url_prefix="/api/datas"
)


# =====================================
# SERIALIZADOR
# =====================================

def serialize_data(doc):

    return {
        "_id": str(doc["_id"]),
        "ministerio": doc.get("ministerio"),
        "data": doc.get("data"),
        "tipo": doc.get("tipo"),
        "nome_evento": doc.get("nome_evento"),
        "escala_criada": doc.get("escala_criada", False),
        "ativo": doc.get("ativo", True),
        "data_cadastro": (
            doc.get("data_cadastro").isoformat()
            if doc.get("data_cadastro")
            else None
        )
    }


# =====================================
# LISTAR DATAS
# =====================================

@datas_bp.route("", methods=["GET"])
def listar_datas():

    ministerio = request.args.get("ministerio")

    filtro = {
        "ativo": True
    }

    if ministerio:
        filtro["ministerio"] = ministerio

    datas = [
        serialize_data(doc)
        for doc in db.datas_escala.find(filtro).sort("data", 1)
    ]

    return jsonify({
        "success": True,
        "total": len(datas),
        "data": datas
    })


# =====================================
# BUSCAR DATA
# =====================================

@datas_bp.route("/<id>", methods=["GET"])
def buscar_data(id):

    try:

        data = db.datas_escala.find_one({
            "_id": ObjectId(id)
        })

        if not data:
            return jsonify({
                "success": False,
                "message": "Data não encontrada."
            }), 404

        return jsonify({
            "success": True,
            "data": serialize_data(data)
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =====================================
# CADASTRAR DATA
# =====================================

@datas_bp.route("", methods=["POST"])
def cadastrar_data():

    try:

        data = request.get_json()

        ministerio = data.get("ministerio")
        data_culto = data.get("data")
        tipo = data.get("tipo")
        nome_evento = data.get("nome_evento")

        if not ministerio:
            return jsonify({
                "success": False,
                "message": "Ministério é obrigatório."
            }), 400

        if not data_culto:
            return jsonify({
                "success": False,
                "message": "Data é obrigatória."
            }), 400

        if not tipo:
            return jsonify({
                "success": False,
                "message": "Tipo é obrigatório."
            }), 400

        tipos_validos = [
            "Domingo",
            "Quinta",
            "Outros"
        ]

        if tipo not in tipos_validos:
            return jsonify({
                "success": False,
                "message": "Tipo inválido."
            }), 400

        if tipo == "Outros" and not nome_evento:
            return jsonify({
                "success": False,
                "message": "Nome do evento é obrigatório."
            }), 400

        existe = db.datas_escala.find_one({
            "ministerio": ministerio,
            "data": data_culto,
            "ativo": True
        })

        if existe:
            return jsonify({
                "success": False,
                "message": "Já existe uma data cadastrada para este ministério."
            }), 400

        documento = {
            "ministerio": ministerio,
            "data": data_culto,
            "tipo": tipo,
            "nome_evento": nome_evento if tipo == "Outros" else None,
            "escala_criada": False,
            "ativo": True,
            "data_cadastro": datetime.utcnow()
        }

        resultado = db.datas_escala.insert_one(documento)

        return jsonify({
            "success": True,
            "message": "Data cadastrada com sucesso.",
            "id": str(resultado.inserted_id)
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =====================================
# EDITAR DATA
# =====================================

@datas_bp.route("/<id>", methods=["PUT"])
def editar_data(id):

    try:

        data = request.get_json()

        ministerio = data.get("ministerio")
        data_culto = data.get("data")
        tipo = data.get("tipo")
        nome_evento = data.get("nome_evento")

        duplicada = db.datas_escala.find_one({
            "ministerio": ministerio,
            "data": data_culto,
            "_id": {
                "$ne": ObjectId(id)
            }
        })

        if duplicada:
            return jsonify({
                "success": False,
                "message": "Já existe uma data cadastrada."
            }), 400

        db.datas_escala.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": {
                    "ministerio": ministerio,
                    "data": data_culto,
                    "tipo": tipo,
                    "nome_evento": nome_evento
                }
            }
        )

        return jsonify({
            "success": True,
            "message": "Data atualizada com sucesso."
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =====================================
# DESATIVAR DATA
# =====================================

@datas_bp.route("/<id>", methods=["DELETE"])
def excluir_data(id):

    try:

        db.datas_escala.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": {
                    "ativo": False
                }
            }
        )

        return jsonify({
            "success": True,
            "message": "Data removida com sucesso."
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# =====================================
# MARCAR ESCALA CRIADA
# =====================================

@datas_bp.route("/<id>/escala-criada", methods=["PUT"])
def marcar_escala_criada(id):

    try:

        db.datas_escala.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": {
                    "escala_criada": True
                }
            }
        )

        return jsonify({
            "success": True,
            "message": "Escala marcada como criada."
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500