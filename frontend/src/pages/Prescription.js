import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function Prescription() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/api/prescriptions');
      setList(res.data.prescriptions || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>처방전 목록</h2>

      {list.length === 0 && <div>처방전 없음</div>}

      {list.map((p, i) => (
        <div
          key={i}
          style={{
            border: '1px solid #ddd',
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <div>환자명: {p.name}</div>
          <div>약국: {p.pharmacy}</div>
          <div>상태: {p.status}</div>
        </div>
      ))}
    </div>
  );
}
