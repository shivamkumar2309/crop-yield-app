import pickle
import numpy as np

def load_model():
    with open("yield_model.pkl", "rb") as f:
        return pickle.load(f)

model = load_model()

def predict_yield(rainfall: float, temperature: float, humidity: float) -> float:
    data = np.array([[rainfall, temperature, humidity]])
    return round(float(model.predict(data)[0]), 2)