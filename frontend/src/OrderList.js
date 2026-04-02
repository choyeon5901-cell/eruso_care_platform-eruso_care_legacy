import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrderList() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
     const interval = setInterval(() => {
      loadOrders();
     }, 3000); // 3초마다

     return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    const res = await axios.get('http://localhost:3001/orders');
    setOrders(res.data);
  };

  return (
    <div>
      <h2>주문 목록</h2>

      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <div>약국: {order.pharmacyName}</div>
          <div>상태: {order.status}</div>
        </div>
      ))}

    </div>
  );
}