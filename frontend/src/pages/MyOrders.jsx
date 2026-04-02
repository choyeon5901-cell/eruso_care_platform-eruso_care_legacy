import { useEffect, useState } from 'react';
import { getOrders, deleteOrder } from '../api/order';
import { useNavigate } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔥 MyOrders 페이지 진입');

    const fetchOrders = async () => {
      try {
        console.log('📡 예약 목록 요청 시작');

        const res = await getOrders();

        console.log('📦 응답:', res);

        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (e) {
        console.error('❌ 목록 에러:', e);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    console.log('🗑 삭제:', id);

    await deleteOrder(id);

    alert('예약 취소 완료');

    const res = await getOrders();
    setOrders(res.orders || []);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🔥 내 예약 목록</h1>

      <button onClick={() => navigate('/map')}>← 지도</button>

      {orders.length === 0 ? (
        <div style={{ marginTop: 20 }}>예약 없음</div>
      ) : (
        orders.map((o) => (
          <div key={o.id} style={{ marginTop: 10 }}>
            📦 {o.pharmacyName}
            <button
              onClick={() => handleDelete(o.id)}
              style={{ marginLeft: 10 }}
            >
              취소
            </button>
          </div>
        ))
      )}
    </div>
  );
}
