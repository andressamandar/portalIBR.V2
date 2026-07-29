from database.mongo import db

try:
    print("Coleções encontradas:")
    print(db.list_collection_names())
    print("\n✅ Conectado ao MongoDB Atlas com sucesso!")

except Exception as e:
    print(f"\n❌ Erro ao conectar:")
    print(e)