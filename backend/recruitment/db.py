import os
from pymongo import MongoClient

# ✅ use docker service name
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

try:
    client.server_info()
    print("MongoDB Connected Successfully")
except Exception as e:
    print("MongoDB Connection Failed:", e)

db = client["smart_hire"]

jobs_collection = db["jobs"]
candidates_collection = db["candidates"]

print("Using Database: smart_hire")