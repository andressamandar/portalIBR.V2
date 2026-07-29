import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    MONGO_URI = os.getenv("MONGO_URI")
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET = os.getenv("JWT_SECRET")

    SENHAS = {
        "lideranca_louvor": os.getenv("SENHA_LIDERANCA_LOUVOR"),
        "lideranca_midia": os.getenv("SENHA_LIDERANCA_MIDIA"),
        "integrante_louvor": os.getenv("SENHA_INTEGRANTE_LOUVOR"),
        "integrante_midia": os.getenv("SENHA_INTEGRANTE_MIDIA"),
    }