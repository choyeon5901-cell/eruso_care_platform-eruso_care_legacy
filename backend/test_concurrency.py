import requests
import threading

# 로그인
res = requests.post(
    "http://localhost:8000/api/auth/login",
    json={
        "loginId": "test4",
        "password": "test4"
    }
)

token = res.json()["token"]
print("토큰:", token)


# 예약 생성 함수
def create():
    res = requests.post(
        "http://localhost:8000/api/patient/reservations",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        json={
            "hospitalId": 1,
            "symptomSummary": "test",
            "preferredAt": "2026-04-01T10:00:00"
        }
    )
    print(res.status_code)


# 동시 실행
threads = []

for _ in range(10):
    t = threading.Thread(target=create)
    t.start()
    threads.append(t)

for t in threads:
    t.join()

print("🔥 테스트 완료")