from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import logging
import dotenv
import os

# Load environment variables from .env file
dotenv.load_dotenv(dotenv_path='app/.env')

logger = logging.getLogger(__name__)

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    database = None

mongodb = MongoDB()

async def connect_to_mongo():
    # Create database connection
    try:
        mongo_url = os.getenv("MONGO_URL")
        if not mongo_url:
            raise ValueError("MONGO_URL is not set in the environment variables")

        mongodb.client = AsyncIOMotorClient(mongo_url)
        mongodb.database = mongodb.client.popeai

        await mongodb.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    # Close database connection
    if mongodb.client:
        mongodb.client.close()
        logger.info("MongoDB connection closed")

def get_database():
    # Get database instance
    return mongodb.database