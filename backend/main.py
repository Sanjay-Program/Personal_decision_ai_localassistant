from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, WebSocket, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn
import os
import json
import asyncio
from pydantic import BaseModel
from typing import List, Optional
from core.orchestrator import orchestrator

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize live streams (Gmail, WhatsApp, SMS)
    asyncio.create_task(orchestrator.start_live_services())
    yield
    # Shutdown: Clean up tasks if needed
    for task in orchestrator.live_tasks:
        task.cancel()

app = FastAPI(title="Personal Local AI Assistant API", lifespan=lifespan)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    stream: bool = True

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    user_query = request.messages[-1].content
    
    async def generate():
        for chunk in orchestrator.process_query(user_query):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")

@app.post("/memory/add")
async def add_memory(message: ChatMessage):
    orchestrator.add_to_memory(message.content)
    return {"status": "success"}

@app.get("/system/stats")
async def system_stats():
    try:
        import psutil
        return {
            "cpu_usage": psutil.cpu_percent(),
            "ram_usage": psutil.virtual_memory().percent,
            "available_ram": round(psutil.virtual_memory().available / (1024 * 1024 * 1024), 2),
            "total_ram": round(psutil.virtual_memory().total / (1024 * 1024 * 1024), 2)
        }
    except ImportError:
        return {"error": "psutil not installed"}

@app.get("/plugins/sms")
async def get_sms():
    if "sms_plugin" in orchestrator.plugins.plugins:
        return orchestrator.plugins.plugins["sms_plugin"].fetch_latest_adb_sms(limit=10)
    return []

@app.get("/plugins/mail")
async def get_mail():
    if "mail" in orchestrator.plugins.plugins:
        return orchestrator.plugins.execute_plugin("mail", "list_emails")
    return []

@app.get("/plugins/status")
async def get_plugin_status():
    return {
        "gmail": "active" if "mail" in orchestrator.plugins.plugins else "inactive",
        "whatsapp": "active" if "whatsapp" in orchestrator.plugins.plugins else "inactive",
        "sms": "active" if "sms_plugin" in orchestrator.plugins.plugins else "inactive",
        "browser": "active" if "browser_plugin" in orchestrator.plugins.plugins else "inactive"
    }

@app.get("/curator/briefing")
async def get_curator_briefing():
    return {"briefing": orchestrator.get_daily_briefing()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
