from datetime import timedelta
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.core.config import ACCESS_TOKEN_EXPIRE_MINUTES


def signup(
    db: Session,
    login_id: str,
    name: str,
    password: str,
    role: str,
    phone: Optional[str] = None,
    email: Optional[str] = None,
):
    existing_user = db.query(User).filter(User.login_id == login_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")

    try:
        new_user = User(
            login_id=login_id,
            name=name,
            password_hash=hash_password(password),
            role=role,
            phone=phone,
            email=email,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "success": True,
            "data": {"userId": new_user.id},
            "message": "회원가입 완료",
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="이미 존재하는 아이디이거나 DB 제약조건 오류입니다.",
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"회원가입 처리 중 서버 오류: {str(e)}",
        )


def login(db: Session, login_id: str, password: str):
    user = db.query(User).filter(User.login_id == login_id).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 올바르지 않습니다.")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"user_id": user.id, "role": user.role},
        expires_delta=access_token_expires,
    )

    return {
        "success": True,
        "data": {
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "role": user.role,
            },
        },
        "message": "로그인 성공",
    }