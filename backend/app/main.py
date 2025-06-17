from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router
from app.db.mongo import connect_to_mongo, close_mongo_connection

'''
from fastapi import FastAPI
from app.models.chat import ChatRequest, ChatResponse
from app.services.chatbot_service import chatbot_response
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
'''
app = FastAPI(title="AI Chat API", version="1.0.0")

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
'''
# Chatbot endpoint
@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    response = chatbot_response(request.question)
    return ChatResponse(
        answer=response,
        id=int(datetime.now().timestamp() * 1000),
        asked_at=datetime.now()
    )
'''

app.include_router(chat_router, prefix="/api")

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/healthz")
def health_check():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "AI Chat API is running"}