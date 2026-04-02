FastAPI + MariaDB + React/Capacitor MVP backend starter

실행 순서
1) Python 가상환경 생성 및 활성화
2) pip install -r requirements.txt
3) MariaDB에 telemed_db 생성
4) 환경변수 설정 또는 app/core/config.py 기본값 사용
5) uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Swagger:
http://localhost:8000/docs
