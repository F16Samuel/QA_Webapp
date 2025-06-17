# Pope AI – Predict, Optimize, Perform, Excel.

A full-stack LLM-powered Q&A chat application built with React, FastAPI, MongoDB, and Docker, deployed via GitHub Actions to AWS.

---

## 🚀 Features

- Ask any question via chat UI
- Stubbed backend responses (LLM-ready)
- Persistent history using MongoDB
- CI/CD pipeline for deployment to AWS

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

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/chat

---

## ☁️ Deployment (via GitHub Actions)

1. Push to `main` branch.
2. Ensure the following GitHub Secrets are set:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `EC2_HOST`
   - `EC2_USER`
   - `EC2_SSH_KEY` (private SSH key)

On push, the pipeline:
- Builds frontend & backend images
- Pushes them to Docker Hub
- SSHes into EC2 and redeploys using `docker-compose`

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
- **DB**: MongoDB (via Docker)
- **CI/CD**: GitHub Actions
- **Cloud**: AWS EC2

---

## 📄 License

MIT