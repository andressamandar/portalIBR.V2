from pymongo import MongoClient

from config import Config


mongo_uri = Config.MONGO_URI

if not mongo_uri or not mongo_uri.strip():
    raise RuntimeError(
        "A variável de ambiente MONGO_URI não está configurada."
    )


client = MongoClient(
    mongo_uri,
    serverSelectionTimeoutMS=10000
)

db = client["portal_ibr"]