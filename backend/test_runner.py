import requests
import json
import websocket
from datetime import datetime

BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000/ws"

TOKEN = None

TEST_USER = {
    "id": "test4",
    "password": "test4"
}

CHECKLIST = [
    {
        "name": "헬스 체크",
        "method": "GET",
        "url": "/health",
        "expected_status": 200
    },
    {
        "name": "보호 API 테스트",
        "method": "GET",
        "url": "/api/protected",
        "expected_status": 200,
        "auth": True
    },
    {
        "name": "예약 생성",
        "method": "POST",
        "url": "/api/patient/reservations",   # 🔥 수정
        "json": {
            "hospitalId": 1,
            "symptomSummary": "두통",
            "preferredAt": "2026-04-01T10:00:00"
        },
        "expected_status": 200,
        "auth": True
    },
    {
        "name": "예약 목록 조회",
        "method": "GET",
        "url": "/api/patient/reservations",   # 🔥 수정
        "expected_status": 200,
        "auth": True
    }
]

# =========================
# 🔐 로그인
# =========================
def get_token():
    global TOKEN

    res = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={
            "loginId": TEST_USER["id"],
            "password": TEST_USER["password"]
        },
        timeout=5
    )

    if res.status_code == 200:
        data = res.json()

        TOKEN = (
            data.get("access_token")
            or data.get("token")
            or (data.get("data") or {}).get("accessToken")
            or (data.get("data") or {}).get("token")
        )

        if not TOKEN:
            print("[ERROR] 토큰 없음:", data)
            exit()

        print("[INFO] 로그인 성공")

    else:
        print("[ERROR] 로그인 실패:", res.status_code, res.text)
        exit()


# =========================
# 🔐 인증 헤더
# =========================
def get_headers(use_bearer=True):
    if not TOKEN:
        return {}

    if use_bearer:
        return {"Authorization": f"Bearer {TOKEN}"}
    else:
        return {"Authorization": TOKEN}


# =========================
# 🔥 API 테스트
# =========================
def run_test(item):
    url = BASE_URL + item["url"]
    method = item["method"]

    try:
        print(f"[DEBUG] {method} {url}")

        headers = {}
        if item.get("auth"):
            headers = get_headers(True)

        if method == "GET":
            res = requests.get(url, headers=headers, timeout=5)
        elif method == "POST":
            res = requests.post(url, json=item.get("json", {}), headers=headers, timeout=5)
        else:
            return False, "지원 안되는 메서드"

        # 🔥 인증 fallback
        if res.status_code == 401 and item.get("auth"):
            print("[DEBUG] Bearer 실패 → 일반 토큰 재시도")

            headers = get_headers(False)

            if method == "GET":
                res = requests.get(url, headers=headers, timeout=5)
            elif method == "POST":
                res = requests.post(url, json=item.get("json", {}), headers=headers, timeout=5)

        if res.status_code != item["expected_status"]:
            return False, f"status={res.status_code}, body={res.text}"

        try:
            data = res.json()
        except:
            data = res.text

        return True, data

    except requests.exceptions.Timeout:
        return False, "Timeout 발생"
    except Exception as e:
        return False, str(e)


# =========================
# 🔥 WebSocket 테스트 (핵심)
# =========================
def test_websocket():
    print("[TEST] WebSocket 연결 테스트")

    try:
        ws = websocket.create_connection(WS_URL)

        # 🔐 토큰 전달
        ws.send(json.dumps({
            "token": TOKEN
        }))

        response = ws.recv()
        data = json.loads(response)

        if data.get("type") == "waiting":
            print("[PASS] WebSocket 연결 성공 (대기 상태)")
        elif data.get("type") == "matched":
            print("[PASS] WebSocket 매칭 성공")
        else:
            print("[FAIL] WebSocket 응답 이상:", data)

        ws.close()

    except Exception as e:
        print("[FAIL] WebSocket 실패:", str(e))


# =========================
# 🔥 실패 로그
# =========================
def save_fail_log(name, msg):
    with open("fail_log.txt", "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now()}] {name} → {msg}\n")


# =========================
# 🚀 전체 실행
# =========================
def run_all_tests():
    print("==== 테스트 시작 ====")

    get_token()

    success = 0
    total = len(CHECKLIST)

    for item in CHECKLIST:
        result, msg = run_test(item)

        if result:
            print(f"[PASS] {item['name']}")
            success += 1
        else:
            print(f"[FAIL] {item['name']} → {msg}")
            save_fail_log(item['name'], msg)

    # 🔥 WebSocket 테스트 실행
    test_websocket()

    print("==== 결과 ====")
    print(f"{success}/{total} 성공")


# =========================
# 실행
# =========================
if __name__ == "__main__":
    run_all_tests()