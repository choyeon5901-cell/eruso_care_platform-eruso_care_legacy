import sys
import os

sys.path.append(r"D:\eruso_care_platform\eruso_care_legacy\backend")

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")   # 👈 여기만 수정
    assert res.status_code == 200