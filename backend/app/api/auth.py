from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from jose import jwt

router = APIRouter()

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"


@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(400, "User not found")

    # ⭐ 여기 수정
    if user.password_hash != password:
        raise HTTPException(400, "Wrong password")

    token = jwt.encode(
        {
            "user_id": user.id,
            "role": user.role
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {"access_token": token}