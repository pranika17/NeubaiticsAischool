from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

from .models import Course, Chapter, StudyMaterial, Faq, Workshop

model = SentenceTransformer("all-MiniLM-L6-v2")

documents = []
index = None


def build_vector_index():
    global documents, index

    documents = []

    # Collect LMS Data
    for c in Course.objects.all():
        documents.append(f"Course: {c.title}. {c.description}")

    for ch in Chapter.objects.all():
        documents.append(f"Chapter: {ch.title}. {ch.description}")

    for sm in StudyMaterial.objects.all():
        documents.append(f"Study Material: {sm.title}. {sm.description}")

    for faq in Faq.objects.all():
        documents.append(f"FAQ: {faq.question}. Answer: {faq.answer}")

    for w in Workshop.objects.all():
        documents.append(f"Workshop: {w.title}. {w.description}")

    embeddings = model.encode(documents)

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings))


def get_ai_response(question, documents):

    if not documents:
        return "No accessible data available."

    embeddings = model.encode(documents)

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings))

    question_embedding = model.encode([question])
    D, I = index.search(np.array(question_embedding), k=3)

    context = ""
    for i in I[0]:
        context += documents[i] + "\n"

    return f"Based on your accessible data:\n{context}"