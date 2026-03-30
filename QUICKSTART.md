# ⚡ Quick Start Guide

**Paytm OmniMatch** is now complete and ready to run!

## 🚀 Start in 3 Steps

### Step 1: Configure API Key
Edit `.env` file and add your Gemini API key:
```env
GOOGLE_GEMINI_API_KEY=your_actual_key_here
```

Get your free Gemini API key: https://makersuite.google.com/app/apikey

### Step 2: Start All Services
Double-click `start.bat` (Windows) or run `bash start.sh` (Mac/Linux)

This will start:
- ✅ Python AI Pipeline (Port 8000)
- ✅ Node.js API Backend (Port 5000)
- ✅ React Frontend (Port 3000)

### Step 3: Open Browser
Navigate to: **http://localhost:3000**

---

## 🎯 What You Get

### Scout AI (Consumer Side)
- 💬 Search deals with natural language
- 🤖 AI-powered recommendations matching your mood/weather
- 🎨 Beautiful deal cards with pricing & discounts
- 📱 QR code for instant checkout

### Vyapar AI (Merchant Side)
- ☀️ Real-time telemetry inputs (weather, foot traffic, sales)
- 🎯 AI-driven discount optimization
- 🖼️ Canvas ad generator with dynamic pricing overlays
- 📊 Live ONDC registry of active deals

---

## 📡 API Documentation

Once running, open these in browser:

- **Frontend**: http://localhost:3000
- **Node.js API Docs**: http://localhost:5000
- **Python AI Docs**: http://localhost:8000/docs (Swagger UI)

---

## 🧪 Quick Test

### Generate a Flash Deal (Merchant)
1. Go to Dashboard → Vyapar AI
2. Select weather: "Rainy"
3. Click "Generate Flash Deal"
4. View Canvas ad with QR code

### Find a Deal (Consumer)
1. Click Scout AI tab
2. Type: "I want something spicy in the rain"
3. See AI-matched deal recommendation
4. Click to view details

---

## 📁 Key Files

```
Backend (Node.js)          → server.js
AI Pipeline (Python)       → python_ai/main.py
Frontend (React)           → frontend/src/App.jsx
Configuration             → .env
Complete setup            → start.bat / start.sh
API examples              → API_TESTING.md
Project details           → README.md
```

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` in root & `frontend/` |
| Python error | Check if `python -m pip install -r python_ai/requirements.txt` completed |
| Port already in use | Close existing process or change PORT in .env |
| Gemini connection error | Verify API key in .env file |

---

## 💡 Next Steps for Hackathon

1. **Add Real ONDC Integration**: Connect to actual ONDC network API
2. **Payment Gateway**: Integrate Paytm/PhonePe checkout flow
3. **Database**: Replace in-memory registry with PostgreSQL
4. **Authentication**: Add merchant & consumer login
5. **Analytics Dashboard**: Track deal performance & user behavior
6. **Mobile App**: Wrap React frontend with React Native
7. **Deployment**: Deploy to AWS/Railway for demo day

---

## 📞 Support

- **Full README**: Open `README.md`
- **API Examples**: Open `API_TESTING.md`
- **Swagger Docs**: Go to `http://localhost:8000/docs`

---

**You're all set! 🚀 Good luck with Fortune '26!**
