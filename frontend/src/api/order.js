import axios from 'axios';

// 🔥 공통 설정
const API = axios.create({
  baseURL: 'http://localhost:8000',
});

// ⭐ 여기다 넣는거다 (이 위치!!)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  console.log('🔥 토큰:', token); // 확인용

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// ✅ 1. 예약 생성
// =========================
export const createOrder = async (data) => {
  try {
    const res = await API.post('/orders/', data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: '예약 생성 실패' };
  }
};

// =========================
// ✅ 2. 내 예약 조회
// =========================
export const getOrders = async () => {
  try {
    const res = await API.get('/orders/');
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: '조회 실패' };
  }
};

// =========================
// ✅ 3. 예약 삭제
// =========================
export const deleteOrder = async (orderId) => {
  try {
    const res = await API.delete(`/orders/${orderId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { detail: '삭제 실패' };
  }
};
