from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router
from app.db.mongo import connect_to_mongo, close_mongo_connection
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(dotenv_path="app/.env")

# Retrieve CORS origin and MongoDB URL
VITE_SERVER = os.getenv("VITE_SERVER")
MONGO_URL = os.getenv("MONGO_URL")
if not VITE_SERVER:
    raise ValueError("VITE_SERVER is not set in the environment.")
if not MONGO_URL:
    raise ValueError("MONGO_URL is not set in the environment.")

# Initialize FastAPI application
app = FastAPI(title="AI Chat API", version="1.0.0")

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[VITE_SERVER, MONGO_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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