from pydantic import BaseModel
from datetime import datetime


class OrderCreate(BaseModel):
    name: str
    phone: str
    date: datetime