# 🌾 Crop Yield Predictor

An AI-powered crop yield prediction system for Uttar Pradesh farmers built with React, FastAPI, and Google Gemini AI.

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![React](https://img.shields.io/badge/react-19-61DAFB)

---

## ✨ Features

- 🌡️ **Live Weather Data** — Real-time weather fetch via OpenWeatherMap API
- 🤖 **AI Farming Advice** — Google Gemini AI powered personalized suggestions
- 📊 **ML Yield Prediction** — Random Forest model trained on UP agricultural data
- 🌱 **Crop Calendar** — AI generated monthly crop recommendations per district
- 🇮🇳 **Bilingual Support** — Hindi & English toggle
- ⚠️ **Risk Alerts** — Flood & drought detection

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | FastAPI (Python) |
| ML Model | Random Forest (scikit-learn) |
| AI Advice | Google Gemini API (Free Tier) |
| Weather | OpenWeatherMap API (Free Tier) |

---

## 📁 Project Structure

**Backend**
- `main.py` — FastAPI app & all endpoints
- `gemini.py` — Gemini AI integration (advice + calendar)
- `weather.py` — Live weather fetch (OpenWeatherMap)
- `model.py` — ML model load & predict
- `config.py` — API keys via .env
- `requirements.txt` — Python dependencies

**Frontend**
- `src/App.jsx` — Full React frontend (dark theme)

---

## 🚀 Setup & Run

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenWeatherMap API key (free)
- Google Gemini API key (free)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```
OPENWEATHER_API_KEY=your_openweather_key
GEMINI_API_KEY=your_gemini_key
```

Run the backend:

```bash
uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/predict` | Yield prediction + AI advice |
| GET | `/weather/{district}` | Live weather data |
| POST | `/crop-calendar` | AI crop calendar |

---

## 👨‍💻 Author

**Shivam Kumar**
- GitHub: [@shivamkumar2309](https://github.com/shivamkumar2309)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).