from google import genai
from config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def _generate(prompt: str) -> str:
    models = ["gemini-2.5-flash", "gemini-1.5-flash"]
    for model in models:
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt
            )
            return response.text
        except Exception as e:
            if "503" in str(e) or "UNAVAILABLE" in str(e):
                continue
            return f"AI unavailable: {str(e)}"
    return "Service temporarily unavailable. Please try again."


def get_ai_advice(
    crop: str,
    district: str,
    temperature: float,
    humidity: float,
    rainfall: float,
    predicted_yield: float,
    weather_desc: str,
    wind_speed: float,
    language: str = "english"
) -> str:
    lang_instruction = "Reply in Hindi language only." if language == "hindi" else "Reply in English only."

    prompt = f"""
    You are an expert agricultural advisor for Uttar Pradesh, India.
    
    Current Situation:
    - District: {district}
    - Crop: {crop}
    - Live Weather: {weather_desc}, Wind: {wind_speed} m/s
    - Temperature: {temperature}°C
    - Humidity: {humidity}%
    - Rainfall (last 1hr): {rainfall}mm
    - Predicted Yield: {predicted_yield} kg/hectare
    
    Give practical, specific farming advice in 4-5 bullet points.
    Consider: irrigation needs, disease risk, harvesting tips, weather impact.
    Be concise and actionable. {lang_instruction}
    """
    return _generate(prompt)


def get_crop_calendar(district: str, language: str = "english") -> str:
    lang_instruction = "Reply in Hindi language only." if language == "hindi" else "Reply in English only."

    prompt = f"""
    You are an expert agricultural advisor for Uttar Pradesh, India.
    
    For the district: {district}
    
    Create a concise crop calendar showing which crops are best for each month.
    Format your response EXACTLY like this, one line per month:
    
    January: [crop1, crop2] - [one reason]
    February: [crop1, crop2] - [one reason]
    ...and so on for all 12 months.
    
    Base it on UP's climate, soil, and farming patterns.
    {lang_instruction}
    """
    return _generate(prompt)