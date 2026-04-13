#!/bin/bash

# ==============================================================================
# THE CURATOR: ABSOLUTE IGNITION SEQUENCE
# ==============================================================================

# Kill any existing background processes on exit
trap "kill 0" EXIT

# Nothing OS Inspired Terminal Header
echo "----------------------------------------------------------------"
echo "  THE CURATOR | PERSONAL INTELLIGENCE ENCLAVE | v1.0         "
echo "----------------------------------------------------------------"
echo "  STATUS: INITIATING COLD START..."
echo ""

# CLEANUP PROTOCOL
echo "[1/4] CLEANUP: Purging ports 8000/3000 and orphaned memory-heavy processes..."
fuser -k 8000/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
# Nuclear cleanup for phantom processes
pkill -f "playwright" 2>/dev/null
pkill -f "chromium" 2>/dev/null
pkill -f "node" 2>/dev/null
sleep 2
echo "      CLEANUP COMPLETE."

# SIMULATION PRIMING
echo "[2/4] SIMULATION: Refreshing Digital Life History..."
cd backend
python3 simulation/data_factory.py
echo "      HISTORY GENERATED."
cd ..

# BACKEND BRAIN IGNITION
echo "[3/4] BACKEND: Igniting reasoning engine on port 8000..."
cd backend
source venv/bin/activate 2>/dev/null || echo "      WARNING: Virtual Env not found. Assuming global path."
python3 main.py &
BACKEND_PID=$!
cd ..

# WAIT FOR BACKEND WARMUP (Staggered start to prevent RAM spikes)
echo "      WAITING FOR AI NEURAL PULSE (10s Stagger)..."
sleep 10

# COMMAND CENTER IGNITION
echo "[4/4] FRONTEND: Launching Web Command Center on port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "----------------------------------------------------------------"
echo "  SYSTEM LIVE: ACCESS COMMAND CENTER AT http://localhost:3000"
echo "  BACKEND LOGS: http://localhost:8000/health"
echo "----------------------------------------------------------------"
echo "  (Press CTRL+C to Shutdown Entire Enclave)"
echo ""

# Keep the script running
wait
