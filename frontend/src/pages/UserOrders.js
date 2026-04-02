import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get('/api/orders');
    setOrders(res.data.orders || []);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>내 예약 상태</h2>

      {orders.map((o) => (
        <div key={o.id}>
          {o.pharmacy} - {o.status}
        </div>
      ))}
    </div>
  );
}
