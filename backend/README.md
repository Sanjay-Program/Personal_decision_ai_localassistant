# 🧠 The Curator: Backend Reasoning Engine

This is the core intelligence hub of the enclave.

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Verify system health and model status. |
| `POST` | `/chat` | Stream reasoning responses from the local LLM. |
| `GET` | `/system/stats` | Fetch real-time CPU/RAM telemetry. |
| `GET` | `/curator/briefing` | Generate a "Daily Briefing" from recent signals. |
| `GET` | `/plugins/status` | Current state of Gmail, SMS, and WhatsApp connectors. |

## 🧠 Neural Model Setup (Mandatory)

The backend requires a local GGUF model to perform reasoning.
- **Model**: Qwen 2.5 1.5B Instruct (GGUF)
- **Repo**: [Hugging Face Repository](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF)
- **Path**: `backend/models/qwen2.5-1.5b-instruct-q4_k_m.gguf`

You can download it automatically using:
```bash
python3 ../scripts/download_model.py
```

## 🔌 Plugins

The backend supports modular plugins located in the `plugins/` directory.

### SMS (ADB)
Fetches messages from a connected Android device.
- **Dependency**: `adb` must be in system PATH.
- **Trigger**: `orchestrator.start_live_services()` spawns a background task for polling.

### Data Factory (Simulation)
Located in `simulation/data_factory.py`. This script generates synthetic user history to ensure the system is functional even when no real signals are connected.

## 💾 Hardware Requirements
For optimal performance, a minimum of **16GB RAM** and an **8-core CPU** is recommended. If using a GPU, ensure the `llama-cpp-python` backend is built with cuBLAS or Metal support.
