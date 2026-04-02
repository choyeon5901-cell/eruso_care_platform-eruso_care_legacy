from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.core.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    hospital_id = Column(Integer)

    type = Column(String(20))
    status = Column(String(20), default="pending")

    date = Column(DateTime)
    reason = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)
