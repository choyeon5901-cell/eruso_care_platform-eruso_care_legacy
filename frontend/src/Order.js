import React, { useEffect, useState } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const API_BASE = 'http://localhost:3001';

  useEffect(() => {
    fetch(`${API_BASE}/orders`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error('주문 목록 조회 실패:', err);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>주문 목록</h2>

      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              marginBottom: '12px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '10px',
            }}
          >
            <h4>{order.pharmacyName}</h4>
            <p>상태: {order.status}</p>
            <p>주문번호: {order.id}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
