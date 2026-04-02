import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { createOrder } from '../api/order';

export default function Map() {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [message, setMessage] = useState('로딩 중...');

  const getName = (p, i) => p?.name || p?.pharmacyName || `약국 ${i + 1}`;

  const getLat = (p) => Number(p?.lat ?? p?.latitude ?? p?.y ?? p?.wgs84Lat);

  const getLng = (p) => Number(p?.lng ?? p?.longitude ?? p?.x ?? p?.wgs84Lon);

  // 🔥 약국 API
  const fetchPharmacies = async () => {
    try {
      const res = await api.get('/api/pharmacy');
      const data = res.data;

      if (data.success) {
        setPharmacies(data.pharmacies || []);
        setMessage(`약국 ${data.pharmacies.length}건`);
      } else {
        setMessage('데이터 없음');
      }
    } catch (e) {
      console.error(e);
      setMessage('API 오류');
    }
  };

  // 🔥 로그인 체크 (localStorage 통일)
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    fetchPharmacies();
  }, [navigate]);

  // 🔥 지도 표시
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      if (!mapRef.current) return;

      const valid = pharmacies.filter(
        (p) => !isNaN(getLat(p)) && !isNaN(getLng(p)),
      );

      const centerLat = valid.length ? getLat(valid[0]) : 36.3504;
      const centerLng = valid.length ? getLng(valid[0]) : 127.3845;

      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(centerLat, centerLng),
        level: 4,
      });

      valid.forEach((p) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(getLat(p), getLng(p)),
        });

        marker.setMap(map);

        window.kakao.maps.event.addListener(marker, 'click', () => {
          setSelectedPharmacy(p);
        });
      });
    });
  }, [pharmacies]);

  // 🔥 예약하기
  const handleReserve = async () => {
    if (!selectedPharmacy) {
      alert('약국 먼저 선택하세요');
      return;
    }

    try {
      await createOrder(selectedPharmacy.name);
      alert('예약 완료!');
    } catch (e) {
      console.error(e);
      alert('예약 실패');
    }
  };

  // 🔥 로그아웃 (localStorage 통일)
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>약국 지도</h2>

      <button onClick={handleLogout}>로그아웃</button>

      {/* 🔥 지도 + 버튼 레이어 */}
      <div style={{ position: 'relative' }}>
        {/* 지도 */}
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: 400,
            background: '#eee',
            position: 'relative',
            zIndex: 1,
          }}
        />

        {/* 🔥 버튼 (지도 위에 올림) */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 10,
            display: 'flex',
            gap: 10,
          }}
        >
          <button onClick={() => navigate('/orders')}>예약 목록</button>
          <button onClick={() => navigate('/prescription')}>처방전 보기</button>
        </div>
      </div>

      <div>{message}</div>

      <div>
        선택:
        {selectedPharmacy ? getName(selectedPharmacy, 0) : '없음'}
      </div>

      <button
        onClick={handleReserve}
        style={{
          marginTop: 10,
          padding: 10,
          background: selectedPharmacy ? 'blue' : 'gray',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {selectedPharmacy ? '예약하기' : '약국 선택 필요'}
      </button>
    </div>
  );
}
