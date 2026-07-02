from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from weather import get_weather
from model import predict_yield
from gemini import get_ai_advice
from gemini import get_ai_advice, get_crop_calendar

app = FastAPI(title="Crop Yield Predictor API")

# React frontend ke liye CORS allow karna zaroori hai
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    district: str
    crop: str
    month: str
    language: str = "english"

@app.get("/")
def root():
    return {"message": "Crop Yield API is running!"}

@app.post("/predict")
def predict(req: PredictRequest):
    # Step 1: Live weather fetch karo
    weather = get_weather(req.district)
    if not weather:
        raise HTTPException(status_code=400, detail="Weather data fetch failed")

    # Step 2: Yield predict karo
    predicted_yield = predict_yield(
        rainfall=weather["rainfall"],
        temperature=weather["temperature"],
        humidity=weather["humidity"]
    )

    # Step 3: AI advice lo
    advice = get_ai_advice(
        crop=req.crop,
        district=req.district,
        temperature=weather["temperature"],
        humidity=weather["humidity"],
        rainfall=weather["rainfall"],
        predicted_yield=predicted_yield,
        weather_desc=weather["weather_desc"],
        wind_speed=weather["wind_speed"],
        language=req.language
    )

    # Step 4: Sab return karo
    return {
        "district": req.district,
        "crop": req.crop,
        "month": req.month,
        "weather": weather,
        "predicted_yield": predicted_yield,
        "ai_advice": advice
    }

@app.get("/weather/{district}")
def weather_only(district: str):
    weather = get_weather(district)
    if not weather:
        raise HTTPException(status_code=400, detail="Weather fetch failed")
    return weather

class CalendarRequest(BaseModel):
    district: str
    language: str = "english"

@app.post("/crop-calendar")
def crop_calendar(req: CalendarRequest):
    calendar = get_crop_calendar(req.district, req.language)
    return {"district": req.district, "calendar": calendar}