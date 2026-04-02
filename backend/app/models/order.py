from fastapi import HTTPException
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))         # 예약자 이름
    phone = Column(String(20))         # 전화번호
    date = Column(DateTime)            # 예약 시간

    user_id = Column(Integer, nullable=False)  # ⭐ 핵심 (유저 연결)

    created_at = Column(DateTime, default=datetime.utcnow)