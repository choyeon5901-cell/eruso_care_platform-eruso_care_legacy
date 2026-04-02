from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate
from app.utils.deps import get_current_user
from app.services.notification import create_notification

router = APIRouter(prefix="/appointments", tags=["appointments"])

@router.post("/")
def create(data: AppointmentCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    appt = Appointment(
        user_id=user,
        hospital_id=data.hospital_id,
        type=data.type,
        date=data.date,
        status="pending"
    )
    db.add(appt)
    db.commit()
    return appt

@router.get("/my")
def my(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Appointment).filter(Appointment.user_id == user).all()

@router.get("/hospital")
def hospital(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Appointment).filter(Appointment.hospital_id == user).all()

@router.patch("/{id}/approve")
def approve(id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).get(id)
    appt.status = "approved"
    db.commit()

    create_notification(db, appt.user_id, "진료 승인되었습니다")

    return appt

@router.patch("/{id}/reject")
def reject(id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).get(id)
    appt.status = "rejected"
    db.commit()

    create_notification(db, appt.user_id, "진료 불가 - 시간 변경해주세요")

    return appt
