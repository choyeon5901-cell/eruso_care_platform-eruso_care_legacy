print("🔥🔥🔥 AUTH ROUTER LOADED 🔥🔥🔥")

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import SECRET_KEY, ALGORITHM

router = APIRouter()


# =========================
# ✅ 요청 모델 (핵심)
# =========================
class LoginRequest(BaseModel):
    loginId: str
    password: str


# =========================
# 🔐 JWT 생성
# =========================
def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=2)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# =========================
# 🔐 로그인 (🔥 완전 수정)
# =========================
@router.post("/login")
def login(payload: LoginRequest):   # 🔥 request 제거

    print("🔥 LOGIN START:", payload.dict())

    fake_users = [
        {"loginId": "admin", "password": "1234", "user_id": 1, "role": "ADMIN"},
        {"loginId": "test4", "password": "test4", "user_id": 2, "role": "PATIENT"},
    ]

    user = next(
        (u for u in fake_users if u["loginId"] == payload.loginId and u["password"] == payload.password),
        None
    )

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({
        "user_id": user["user_id"],
        "username": user["loginId"],
        "role": user["role"]
    })

    return {
        "success": True,
        "access_token": token,
        "token": token,  # 🔥 test_runner 호환
    }


# =========================
# 🔐 사용자 정보
# =========================
@router.get("/me")
def get_me():
    return {
        "user_id": 2,
        "username": "test4",
        "role": "PATIENT"
    }