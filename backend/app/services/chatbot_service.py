import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path='app/.env')

# Load the Gemini API key
api_key = os.getenv("GEMINI_API_KEY")
if api_key is None:
    raise ValueError("GEMINI_API_KEY is not set. Please check your .env file.")
else:
    print("GEMINI_API_KEY loaded successfully.")

# Configure Gemini
genai.configure(api_key=api_key)

# Initialize the model
model = genai.GenerativeModel("gemini-1.5-flash")

# Initialize chat history (Gemini handles context in chat sessions)
chat = model.start_chat(history=[])

# Optional system prompt can be passed as a message to the chat
system_prompt = {
    "role": "user",
    "parts": ["You are a helpful assistant with good conversational skills."]
}
chat.send_message(system_prompt["parts"][0])

def chatbot_response(user_message: str) -> str:
    """
    This function takes user input, formats it as an environmental AI assistant prompt,
    sends it to the Gemini API, and returns the chatbot response.
    """
    try:
        prompt = f"""
You are EnviroMind, a helpful and intelligent environmental AI assistant.

You are designed to provide clear, structured, and insightful answers on topics including but not limited to:

-- Climate change and global warming  
-- Sustainability and circular economy  
-- Renewable energy sources (solar, wind, hydro, etc.)  
-- Pollution (air, water, soil) and mitigation strategies  
-- Biodiversity and conservation  
-- Eco-friendly technologies and innovations  
-- Environmental policies, SDGs, and green practices  
-- Waste management and recycling  

When answering, follow these formatting rules:

Keep your tone professional yet friendly, focused on helping users understand or take action.

Keep the maximum number of words to 300.

DONT LEAVE MORE THEN ONE LINE BLANK BETWEEN PARAGRAPHS.

Here is the user's question:

{user_message}
"""

        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        return "Sorry, I couldn't process your request."
