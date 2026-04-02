from datetime import datetime
from sqlalchemy.orm import Session
from app.models.reservation import TelemedReservation


def generate_reservation_no() -> str:
    return f"RSV-{datetime.now().strftime('%Y%m%d%H%M%S')}"


# 🔥 추가 (이게 핵심)
def parse_datetime(dt):
    if not dt:
        return None

    try:
        if isinstance(dt, str) and dt.endswith("Z"):
            dt = dt.replace("Z", "+00:00")

        return datetime.fromisoformat(dt)

    except Exception as e:
        print("🔥 DATETIME ERROR:", str(e))
        return None


def create_reservation(
    db: Session,
    patient_user_id: int,
    hospital_id: int,
    symptom_summary: str,
    preferred_at: str,
):
    try:
        print("🔥 INPUT:", preferred_at, hospital_id, symptom_summary)

        dt = parse_datetime(preferred_at)

        if not dt:
            dt = datetime.now()

        reservation = TelemedReservation(
            reservation_no=generate_reservation_no(),
            patient_user_id=patient_user_id,
            hospital_id=hospital_id if hospital_id else 1,
            symptom_summary=symptom_summary or "",
            preferred_at=dt,
            status="REQUESTED",
        )

        db.add(reservation)
        db.commit()
        db.refresh(reservation)

        return reservation

    except Exception as e:
        db.rollback()
        print("🔥 DB INSERT ERROR:", str(e))
        raise


def get_patient_reservations(db: Session, patient_user_id: int):
    return (
        db.query(TelemedReservation)
        .filter(TelemedReservation.patient_user_id == patient_user_id)
        .order_by(TelemedReservation.id.desc())
        .all()
    )