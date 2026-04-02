from fastapi import APIRouter, WebSocket

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    while True:
        await ws.send_text("서버 알림 테스트")
