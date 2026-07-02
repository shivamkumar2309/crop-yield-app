import requests
from config import OPENWEATHER_API_KEY

def get_weather(city: str):
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url)
        data = response.json()

        # Fix: cod int bhi ho sakta hai, string bhi
        if int(data.get("cod", 0)) != 200:
            return None

        return {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "rainfall": data.get("rain", {}).get("1h", 0.0),
            "weather_desc": data["weather"][0]["description"],
            "wind_speed": data["wind"]["speed"]
        }
    except Exception as e:
        print(f"Weather error: {e}")
        return None