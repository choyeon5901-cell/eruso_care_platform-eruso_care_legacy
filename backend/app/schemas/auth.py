from pydantic import BaseModel, EmailStr
from typing import Optional


class SignupRequest(BaseModel):
    role: str
    name: str
    loginId: str
    password: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


class LoginRequest(BaseModel):
    loginId: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    role: str

    class Config:
        from_attributes = True


class LoginResponseData(BaseModel):
    token: str
    user: UserResponse
