from pydantic import BaseModel
from datetime import datetime

class AppointmentCreate(BaseModel):
    hospital_id: int
    type: str
    date: datetime
