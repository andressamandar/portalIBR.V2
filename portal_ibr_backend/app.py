from flask import Flask
from flask_cors import CORS
from routes.datas import datas_bp
from routes.disponibilidades import disponibilidades_bp
from routes.escalas import escalas_bp
from routes.usuarios import usuarios_bp
from routes.integrantes import integrantes_bp
from routes.louvores import louvores_bp
from routes.louvores_escala import louvores_escala_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(integrantes_bp)
app.register_blueprint(datas_bp)
app.register_blueprint(disponibilidades_bp)
app.register_blueprint(escalas_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(louvores_bp)
app.register_blueprint(louvores_escala_bp)

@app.route("/")
def home():
    return {
        "success": True,
        "sistema": "Portal IBR API",
        "versao": "1.0.0"
    }

if __name__ == "__main__":
    app.run(debug=True)