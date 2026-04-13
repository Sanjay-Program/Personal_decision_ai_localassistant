# 📱 The Curator: Mobile Intelligence Core

A local-first intelligence companion for iOS and Android.

## 🌟 Key Features
- **Local Inference**: Uses `llama.rn` to run GGUF models directly on-device. No internet required for reasoning.
- **Desktop Sync**: Connects to the main Curator Enclave for shared memory and signal access.
- **Privacy First**: All data is stored in secure Keychain and filesystem buffers.

## 🛠️ Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Prepare Models
Download a small GGUF model (like Qwen2.5 0.5B or 1.5B) and place it in the application's secure documents directory or include it in the `assets/` bundle.

### 3. Build & Run
- **Android**: `npm run android`
- **iOS**: `cd ios && pod install && cd .. && npm run ios`

## 🧱 Technology Stack
- **Framework**: React Native 0.75+
- **Inference Engine**: `llama.rn`
- **Networking**: Websockets for real-time synchronization.
- **Icons**: Lucide-React-Native.
