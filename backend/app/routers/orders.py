from fastapi import APIRouter

router = APIRouter()

# 임시 메모리 DB
orders_db = [
    {"pharmacy": "서울약국", "status": "대기"},
    {"pharmacy": "중앙약국", "status": "대기"},
]

@router.get("/api/orders")
def get_orders():
    return {"orders": orders_db}

@router.post("/api/orders/approve")
def approve_order(id: int):
    for o in orders_db:
        if o["id"] == id:
            o["status"] = "승인"
    return {"success": True}

@router.post("/api/orders/reject")
def reject_order(id: int):
    for o in orders_db:
        if o["id"] == id:
            o["status"] = "거절"
    return {"success": True}




from fastapi import APIRouter

router = APIRouter()

orders_db = [
    {"id": 1, "pharmacy": "서울약국", "status": "대기"},
    {"id": 2, "pharmacy": "중앙약국", "status": "대기"},
]


