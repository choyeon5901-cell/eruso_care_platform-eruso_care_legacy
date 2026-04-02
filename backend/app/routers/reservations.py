from jose import jwt, JWTError
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import SECRET_KEY, ALGORITHM
from app.schemas.reservation import ReservationCreateRequest
from app.services.reservation_service import create_reservation, get_patient_reservations

router = APIRouter(tags=["reservations"])


# =========================
# 🔐 유연 + 안정 토큰 인증 (디버깅 포함)
# =========================
def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")

    # ✅ Bearer / 일반 토큰 처리
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # 🔥 디버깅 로그 (반드시 찍어봐야 함)
        print("==== JWT DEBUG ====")
        print("TOKEN:", token)
        print("PAYLOAD:", payload)
        print("===================")

        user_id = payload.get("user_id")
        role = payload.get("role")

        # 🔥 핵심: payload 구조 검증
        if not user_id or not role:
            raise HTTPException(status_code=401, detail="토큰 payload 오류")

        return {
            "user_id": user_id,
            "role": role,
        }

    except Exception as e:
        print("🔥 예약 생성 에러:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# 📌 예약 생성
# =========================
@router.post("")
def create_reservation_api(
    payload: ReservationCreateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # 🔥 role 대소문자 안정 처리
    if current_user["role"].upper() != "PATIENT":
        raise HTTPException(status_code=403, detail="환자만 예약할 수 있습니다.")

    reservation = create_reservation(
        db=db,
        patient_user_id=current_user["user_id"],
        hospital_id=payload.hospitalId,
        symptom_summary=payload.symptomSummary,
        preferred_at=payload.preferredAt,
    )

    return {
        "success": True,
        "data": {
            "reservationId": reservation.id,
            "reservationNo": reservation.reservation_no,
            "status": reservation.status,
        },
        "message": "예약이 접수되었습니다.",
    }


# =========================
# 📌 예약 목록 조회
# =========================
@router.get("")
def list_reservations_api(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"].upper() != "PATIENT":
        raise HTTPException(status_code=403, detail="환자만 조회할 수 있습니다.")

    items = get_patient_reservations(
        db=db,
        patient_user_id=current_user["user_id"]
    )

    return {
        "success": True,
        "data": [
            {
                "reservationId": item.id,
                "reservationNo": item.reservation_no,
                "hospitalId": item.hospital_id,
                "preferredAt": item.preferred_at.isoformat() if item.preferred_at else None,
                "status": item.status,
            }
            for item in items
        ],
        "message": "OK",
    }