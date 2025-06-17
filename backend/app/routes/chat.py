from fastapi import APIRouter, HTTPException, status
from typing import List
from datetime import datetime
from app.models.chat import ChatRequest, ChatResponse, ChatRecord
from app.services.chatbot_service import chatbot_response
from app.db.mongo import get_database
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def serialize_chat_record(record: dict) -> dict:
    # Convert MongoDB record to serializable format
    if record:
        record["id"] = str(record["_id"])
        del record["_id"]
    return record

@router.post("/chat", response_model=ChatResponse)
async def create_chat(request: ChatRequest):
    # Create a new chat interaction
    try:
        # Validate input - Pydantic will handle empty string validation
        if not request.question.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Question cannot be empty"
            )
        
        # Get AI response
        ai_response = chatbot_response(request.question)
        
        # Create chat record
        chat_record = {
            "question": request.question.strip(),
            "answer": ai_response,
            "asked_at": datetime.now()
        }
        
        # Save to MongoDB
        db = get_database()
        result = await db.chats.insert_one(chat_record)
        
        # Return response with MongoDB ObjectId as string
        return ChatResponse(
            answer=ai_response,
            id=str(result.inserted_id),
            asked_at=chat_record["asked_at"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/chat", response_model=List[ChatRecord])
async def get_all_chats():
    # Get all chat records
    try:
        db = get_database()
        cursor = db.chats.find().sort("asked_at", -1)  # Most recent first
        chats = await cursor.to_list(length=None)
        
        # Serialize ObjectIds
        return [serialize_chat_record(chat) for chat in chats]
        
    except Exception as e:
        logger.error(f"Error retrieving chats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@router.get("/chat/{chat_id}", response_model=ChatRecord)
async def get_chat_by_id(chat_id: str):
    # Get a specific chat record by ID
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(chat_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid chat ID format"
            )
        
        db = get_database()
        chat = await db.chats.find_one({"_id": ObjectId(chat_id)})
        
        if not chat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat not found"
            )
        
        return serialize_chat_record(chat)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving chat {chat_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )