# 🏗️ Architecture Deep Dive

## 🧠 The Reasoning Engine (Backend)

The "Brain" of The Curator is a FastAPI service that orchestrates multiple plugins and a local LLM.

### Orchestrator Logic
1.  **Signal Intake**: Plugins (Mail, SMS, WA) periodically fetch new "signals".
2.  **Vector Memory**: Signals are embedded and stored in a local vector store.
3.  **Context Construction**: When a user queries the system, the Orchestrator retrieves relevant memories and live system stats.
4.  **Local Inference**: The LLM processes the query with retrieved context and streams the response.

### Plugin System
Each plugin is a standalone class that follows a common interface.
- **Mail Plugin**: Uses IMAP/OAuth to fetch headers.
- **SMS Plugin**: Uses `adb shell content query` to pull messages from a connected Android device.

---

## 🖥️ Command Center (Frontend)

Built with **Next.js**, the Command Center is designed for high-density information display.

### Key Screens
- **The Grid**: A live view of all incoming signals.
- **Telemetry**: Real-time monitoring of CPU/RAM/GPU usage.
- **Intelligence Node**: The primary chat interface.

---

## 📱 Mobile Intelligence Core

The mobile app is not just a viewer; it's a peer.
- **`llama.rn`**: Runs LLM inference directly on your phone using Neural Engines (e.g., Apple A-series or Snapdragon).
- **Sync Protocol**: Uses a bi-directional websocket to stay in sync with the Desktop Enclave.
