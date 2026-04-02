from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class TelemedReservation(Base):
    __tablename__ = "telemed_reservation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    reservation_no = Column(String(50))
    patient_user_id = Column(Integer)
    hospital_id = Column(Integer)
    symptom_summary = Column(String(255))
    preferred_at = Column(DateTime)
    status = Column(String(20))

    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())