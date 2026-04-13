# 🛠️ Development Guide

This document outlines the technical requirements and setup procedures for **The Curator**.

## 📋 Prerequisites

- **Python 3.10+**: For the backend reasoning engine.
- **Node.js 18+**: For the Next.js frontend and React Native mobile development.
- **ADB (Android Debug Bridge)**: Required for the SMS plugin to fetch live messages from a connected phone.
- **Git**: For version control.

---

## 🚀 Setup Steps

### 1. Backend Configuration
Navigate to the `backend` directory:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Neural Model Setup (Mandatory)
The assistant requires a GGUF model to function. We use **Qwen 2.5 1.5B**.
- **Model Hub**: [Hugging Face Repository](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF)
- **Direct Download**: [qwen2.5-1.5b-instruct-q4_k_m.gguf](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf)

**Automatic Download**:
Run the provided script to automatically fetch and place the model:
```bash
python3 scripts/download_model.py
```

**Manual Placement**:
If downloading manually, place the `.gguf` file in:
`backend/models/qwen2.5-1.5b-instruct-q4_k_m.gguf`

### 3. Frontend Configuration
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
```

### 3. Mobile Configuration
Navigate to the `mobile` directory:
```bash
cd mobile
npm install
# For iOS (Mac only):
cd ios && pod install && cd ..
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:
```env
MODEL_PATH=./models/qwen2.5-1.5b-instruct-q4_k_m.gguf
DATABASE_URL=sqlite:///./memory/curator.db
ADB_DEVICE_ID=your_device_id
```

---

## 🧪 Running Tests

The system uses a **Data Factory** to simulate real-life history for testing without using your actual private data.
```bash
cd backend
python3 simulation/data_factory.py
```
This will populate the `memory/` folder with synthetic signals (SMS, Mails, Logs).
