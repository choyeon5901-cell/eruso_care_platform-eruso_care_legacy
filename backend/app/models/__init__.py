# =========================
# 🔥 Base 연결
# =========================
from app.core.database import Base

# =========================
# 🔥 모델 등록 (순서 중요)
# =========================
from .user import User
from .reservation import TelemedReservation

# 👉 앞으로 모델 추가 시 여기에 계속 등록
# from .user import User
# from .doctor import Doctor