import React, { useEffect, useState } from "react";
import api from "../api/client";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // =========================
  // 🔥 기존 fetchOrders 유지 + 로그만 추가
  // =========================
  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders");

      console.log("🔥 주문 데이터:", res.data);

      const ordersData =
        res.data.orders || res.data.data?.orders || [];

      setOrders(ordersData);
    } catch (e) {
      console.error("🔥 API 에러:", e);
    }
  };

  // =========================
  // 🔥 추가 1: 자동 갱신
  // =========================
  useEffect(() => {
    fetchOrders();

    // const interval = setInterval(fetchOrders, 3000); // 🔥 추가
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // 🔥 추가 2: 승인 / 거절
  // =========================
  const approve = async (pharmacy) => {
  try {
    await api.post("/api/orders/approve", null, {
      params: { pharmacy },
    });

    alert("승인 완료 👍");   // 🔥 추가

    fetchOrders();
  } catch (e) {
    console.error(e);
    alert("승인 실패");
  }
};

  const reject = async (pharmacy) => {
  try {
    await api.post("/api/orders/reject", null, {
      params: { pharmacy },
    });

    alert("거절 완료 👍");   // 🔥 이거 추가

    fetchOrders();
  } catch (e) {
    console.error(e);
    alert("거절 실패");
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h2>예약 목록 (실시간)</h2>

      {orders.length === 0 && <div>데이터 없음</div>}

      {orders.map((o, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div>약국: {o.pharmacy}</div>
          <div>상태: {o.status}</div>

          {/* 🔥 추가 3: 버튼만 삽입 */}
          <button onClick={() => approve(o.pharmacy)}>승인</button>
          <button onClick={() => reject(o.pharmacy)}>거절</button>
        </div>
      ))}
    </div>
  );
}