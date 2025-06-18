# Pope AI – Predict, Optimize, Perform, Excel.

A full-stack LLM-powered Q&A chat application built with React, FastAPI, MongoDB, and Docker.

---

## 🚀 Features

- Ask any question via chat UI
- Stubbed backend responses (LLM-ready)
- Persistent history using MongoDB

---

## 📁 Project Structure

```
pope-ai/
├── frontend/          # Vite + React App
├── backend/           # FastAPI API with MongoDB
├── infra/             # Docker Compose + Mongo Init
└── .github/workflows  # GitHub Actions CI/CD
```

---

## 🧪 Local Setup (via Docker)

```bash
# Clone the repo
git clone https://github.com/F16Samuel/QA_WEBAPP.git
cd pope-ai

# Copy .env template
cp infra/.env.example .env

# Start everything
docker compose -f infra/docker-compose.yml up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000/api/chat

---

## 🔌 API Endpoints

- `POST /api/chat`  
  ```json
  { "question": "What is AI?" }
  ```
- `GET /api/chat` – All chats
- `GET /api/chat/{id}` – Single chat by ID

---

## 📸 UI Screenshot

_See reference image (design.png)_

---

## 📚 Tech Stack

- **Frontend**: React (Vite), CSS
- **Backend**: FastAPI, Pydantic
- **DB**: MongoDB

---

## 📄 License

MIT