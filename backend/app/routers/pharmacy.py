from fastapi import APIRouter

router = APIRouter(prefix="/pharmacy", tags=["pharmacy"])

@router.get("")
def get_pharmacies():
    return {
        "success": True,
        "pharmacies": [
            {
                "name": "테스트약국",
                "lat": 36.3504,
                "lng": 127.3845,
            }
        ],
    }