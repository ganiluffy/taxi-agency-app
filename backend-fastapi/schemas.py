from pydantic import BaseModel

class FareRequest(BaseModel):
    distance_km: float
    booking_type: str  # "ride" or "full-day"

class FareResponse(BaseModel):
    base_fare: float
    per_km_rate: float
    tax_percent: float
    total_fare: float
