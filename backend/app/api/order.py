from fastapi import APIRouter, Depends, HTTPException
from app.utils.deps import get_current_user
from app.core.database import get_db
from sqlalchemy.orm import Session
from app.models.order import Order
from app.schemas.order import OrderCreate

router = APIRouter()


# ⭐ 여기부터 시작
@router.post("/")
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    existing = db.query(Order).filter(
        Order.date == order.date
    ).first()

    if existing:
        raise HTTPException(400, "이미 예약된 시간입니다")

    new_order = Order(
        name=order.name,
        phone=order.phone,
        date=order.date,
        user_id=user   # ⭐ 여기 수정
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order