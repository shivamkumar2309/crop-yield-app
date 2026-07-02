# 🌾 Crop Yield Predictor

An AI-powered crop yield prediction system for Uttar Pradesh farmers built with React, FastAPI, and Google Gemini AI.

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![React](https://img.shields.io/badge/react-19-61DAFB)

## ✨ Features

- 🌡️ **Live Weather Data** — Real-time weather fetch via OpenWeatherMap API
- 🤖 **AI Farming Advice** — Google Gemini AI powered personalized suggestions
- 📊 **ML Yield Prediction** — Random Forest model trained on UP agricultural data
- 🌱 **Crop Calendar** — AI generated monthly crop recommendations per district
- 🇮🇳 **Bilingual Support** — Hindi & English toggle
- ⚠️ **Risk Alerts** — Flood & drought detection

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | FastAPI (Python) |
| ML Model | Random Forest (scikit-learn) |
| AI Advice | Google Gemini API |
| Weather | OpenWeatherMap API |

## 📁 Project Structure

crop-yield-app/
├── backend/
│   ├── main.py          # FastAPI app
│   ├── gemini.py        # Gemini AI integration
│   ├── weather.py       # Live weather fetch
│   ├── model.py         # ML model
│   ├── config.py        # API keys
│   └── requirements.txt
├── frontend/
│   └── src/
│       └── App.jsx      # React frontend
└── README.md

## 🚀 Setup & Run

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file in `backend/`:

OPENWEATHER_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/predict` | Yield prediction + AI advice |
| GET | `/weather/{district}` | Live weather |
| POST | `/crop-calendar` | AI crop calendar |

## 📸 Screenshots

> Coming soon

## 👨‍💻 Author

**Shivam Kumar**
- GitHub: [@shivamkumar2309](https://github.com/shivamkumar2309)

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.