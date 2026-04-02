from sqlalchemy import Column, String, BigInteger, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)

    login_id = Column(String(50), unique=True, index=True)
    username = Column(String(50))
    role = Column(String(30), nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=True)
    email = Column(String(150), nullable=True)
    status = Column(String(30), nullable=False, default="ACTIVE")

    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()  # 🔥 이 줄이 깨져 있었음
    )