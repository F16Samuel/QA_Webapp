from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, description="The question to ask the AI")
    
    @validator('question')
    def question_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Question cannot be empty')
        return v.strip()

class ChatResponse(BaseModel):
    answer: str
    id: str
    asked_at: datetime

class ChatRecord(BaseModel):
    id: str
    question: str
    answer: str
    asked_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }