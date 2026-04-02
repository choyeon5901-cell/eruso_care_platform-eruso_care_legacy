from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from app.core.config import SECRET_KEY, ALGORITHM

# router import
from app.routers.auth import router as auth_router
from app.routers.reservations import router as reservation_router
from app.routers.orders import router as orders_router

from app.core.database import engine, Base
import app.models  # 🔥 모델 강제 로딩

# =========================
# 🔥 FastAPI 생성 (먼저!)
# =========================
app = FastAPI()

# =========================
# 🔥 DB 초기화 (여기 위치!)
# =========================
@app.on_event("startup")
def init_db():
    print("🔥 DB 초기화 시작")
    Base.metadata.create_all(bind=engine)
    print("🔥 DB 초기화 완료")

# =========================
# CORS 설정
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 🔥 라우터 등록
# =========================
app.include_router(auth_router, prefix="/api/auth")
app.include_router(reservation_router, prefix="/api/patient/reservations")
app.include_router(orders_router, prefix="/api/orders")

# =========================
# 🔐 JWT 검증
# =========================
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# =========================
# 🔐 보호 API
# =========================
@app.get("/api/protected")
def protected(user=Depends(verify_token)):
    return {"success": True, "user": user}

# =========================
# 🏥 Health Check
# =========================
@app.get("/health")
def health():
    return {"status": "ok"}

# =========================
# 📹 WebSocket
# =========================
waiting_users = []
rooms = {}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        init_data = await websocket.receive_json()
        token = init_data.get("token")

        if not token:
            raise Exception("토큰 없음")

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("username")

        print(f"🔐 인증 성공: {username}")

    except Exception as e:
        print("❌ 인증 실패:", str(e))
        await websocket.close()
        return

    print("👤 사용자 접속")

    if len(waiting_users) == 0:
        waiting_users.append(websocket)
        await websocket.send_json({"type": "waiting"})
        return

    partner = waiting_users.pop(0)

    room_id = f"room_{id(websocket)}"
    rooms[room_id] = [partner, websocket]

    await partner.send_json({"type": "matched", "role": "caller"})
    await websocket.send_json({"type": "matched", "role": "callee"})

    try:
        while True:
            data = await websocket.receive_text()

            for conn in rooms[room_id]:
                if conn != websocket:
                    try:
                        await conn.send_text(data)
                    except:
                        pass

    except WebSocketDisconnect:
        print("❌ 연결 종료")

    finally:
        if websocket in waiting_users:
            waiting_users.remove(websocket)

        if room_id in rooms:
            rooms[room_id] = [c for c in rooms[room_id] if c != websocket]

            if len(rooms[room_id]) == 0:
                del rooms[room_id]