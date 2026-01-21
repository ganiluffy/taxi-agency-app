from fastapi import FastAPI
from schemas import FareRequest, FareResponse

app = FastAPI(title="Taxi Fare Engine")

# Temporary config (admin-controlled later)
BASE_FARE = 100
PER_KM_RATE = 25
FULL_DAY_FARE = 2500
TAX_PERCENT = 5

@app.get("/")
def root():
    return {"message": "Fare Engine Running"}

@app.post("/calculate-fare", response_model=FareResponse)
def calculate_fare(data: FareRequest):
    if data.booking_type == "full-day":
        total = FULL_DAY_FARE
    else:
        total = BASE_FARE + (data.distance_km * PER_KM_RATE)

    tax = (total * TAX_PERCENT) / 100
    total_with_tax = total + tax

    return FareResponse(
        base_fare=BASE_FARE,
        per_km_rate=PER_KM_RATE,
        tax_percent=TAX_PERCENT,
        total_fare=round(total_with_tax, 2),
    )
