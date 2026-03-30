#!/bin/bash

# Paytm OmniMatch - Complete Startup Script
# Starts both Node.js backend and Python FastAPI backend

echo "🚀 Starting Paytm OmniMatch..."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $NODE_PID 2>/dev/null
    kill $PYTHON_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT

# Start Python FastAPI backend in background
echo "📡 Starting Python AI Pipeline (FastAPI)..."
echo "   Port: http://localhost:8000"
cd python_ai
python -m pip install -q -r requirements.txt 2>/dev/null || pip install -q -r requirements.txt
python main.py &
PYTHON_PID=$!
sleep 2

# Start Node.js Express backend in background
echo "📡 Starting Node.js Backend (Express)..."
echo "   Port: http://localhost:5000"
cd ..
node server.js &
NODE_PID=$!
sleep 2

# Start React frontend
echo "🎨 Starting React Frontend (Vite)..."
echo "   Port: http://localhost:3000"
cd frontend
npm run dev &
REACT_PID=$!

# Wait for all processes
echo ""
echo "✅ All services started!"
echo ""
echo "📱 Open your browser:"
echo "   Frontend:        http://localhost:3000"
echo "   Node.js API:     http://localhost:5000"
echo "   Python AI Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

wait
