from pydantic import BaseModel
from typing import Optional


class ReservationCreateRequest(BaseModel):
    hospitalId: int
    symptomSummary: Optional[str] = None
    preferredAt: str


class ReservationCreateResponse(BaseModel):
    reservationId: int
    reservationNo: str
    status: str
