import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HospitalDashboard() {
  const [list, setList] = useState([]);

  const load = async () => {
    const token = localStorage.getItem('token');

    const res = await axios.get('http://localhost:8000/appointments/hospital', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setList(res.data);
  };

  const approve = async (id) => {
    await axios.patch(`http://localhost:8000/appointments/${id}/approve`);
    load();
  };

  const reject = async (id) => {
    await axios.patch(`http://localhost:8000/appointments/${id}/reject`);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>병원 예약 관리</h2>

      {list.map((a) => (
        <div
          key={a.id}
          style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}
        >
          <div>환자ID: {a.user_id}</div>
          <div>시간: {a.date}</div>
          <div>상태: {a.status}</div>

          <button onClick={() => approve(a.id)}>승인</button>
          <button onClick={() => reject(a.id)}>거절</button>
        </div>
      ))}
    </div>
  );
}
