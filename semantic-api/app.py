from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer, util

app = FastAPI()
model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

@app.post("/embed")
async def embed(request: Request):
    data = await request.json()
    text = data.get("text", "")
    embedding = model.encode(text).tolist()
    return {"embedding": embedding}

@app.post("/similarity")
async def similarity(request: Request):
    data = await request.json()
    emb1 = data["embedding1"]
    emb2 = data["embedding2"]
    sim = float(util.cos_sim([emb1], [emb2])[0][0])
    return {"similarity": sim}
