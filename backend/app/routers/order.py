from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.order import Order

router = APIRouter(prefix="/orders", tags=["orders"])


# 🔥 예약 생성
@router.post("")
def create_order(data: dict, db: Session = Depends(get_db)):
    pharmacy_name = data.get("pharmacyName")

    if not pharmacy_name:
        raise HTTPException(status_code=400, detail="약국 이름 없음")

    order = Order(
        pharmacy_name=pharmacy_name
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    print("🔥 DB 저장 완료:", order.id)

    return {
        "success": True,
        "data": {
            "id": order.id,
            "pharmacyName": order.pharmacy_name
        }
    }


# 🔥 예약 목록 조회
@router.get("")
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.id.desc()).all()

    return {
        "success": True,
        "orders": [
            {
                "id": o.id,
                "pharmacyName": o.pharmacy_name,
                "createdAt": o.created_at
            }
            for o in orders
        ]
    }


# 🔥 예약 삭제
@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="예약 없음")

    db.delete(order)
    db.commit()

    return {
        "success": True,
        "message": "예약 취소 완료"
    }