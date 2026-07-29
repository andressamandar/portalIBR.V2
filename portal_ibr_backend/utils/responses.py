from flask import jsonify


def success(data=None, message=None, status=200, total=None):
    response = {
        "success": True
    }

    if message:
        response["message"] = message

    if data is not None:
        response["data"] = data

    if total is not None:
        response["total"] = total

    return jsonify(response), status


def error(message, status=400):
    return jsonify({
        "success": False,
        "message": message
    }), status