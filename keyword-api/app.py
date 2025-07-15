from fastapi import FastAPI, Request
from keybert import KeyBERT

app = FastAPI()
kw_model = KeyBERT('paraphrase-multilingual-MiniLM-L12-v2')

STOPWORDS = set([
    'and', 'or', 'for', 'the', 'with', 'to', 'of', 'in', 'on', 'by', 'about',
    'is', 'are', 'this', 'that', 'these', 'those', 'from', 'at', 'it', 'as', 'an', 'a'
])

def is_good_phrase(phrase: str) -> bool:
    words = phrase.split()
    # Мають бути тільки слова, довші за 2 символи, не стоп-слова, і не містити виключно чисел
    if len(words) < 2:
        return False
    if all((w.lower() not in STOPWORDS and len(w) > 2 and not w.isdigit()) for w in words):
        return True
    return False

@app.post("/extract")
async def extract_keywords(request: Request):
    data = await request.json()
    text = data.get('text', '').strip()

    # Легке autoscale за довжиною тексту
    length = len(text.split())
    if length < 60:
        top_n = 3
    elif length < 300:
        top_n = 7
    else:
        top_n = 14

    keywords = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(2, 3),     # Тільки бі/триграми — саме сенсові фрази
        stop_words='english',             # Для англійської; для міксу можна None
        top_n=top_n
    )

    seen = set()
    keywords_only = []
    for phrase, score in keywords:
        clean_phrase = phrase.strip().lower()
        if clean_phrase not in seen and is_good_phrase(clean_phrase):
            keywords_only.append(clean_phrase)
            seen.add(clean_phrase)
    return {"keywords": keywords_only}
