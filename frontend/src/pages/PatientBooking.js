import { useState } from "react";
import axios from "axios";

export default function PatientBooking() {
  const [date, setDate] = useState("");
  const [type, setType] = useState("video");

  const submit = async () => {
    const token = localStorage.getItem("token");

    await axios.post("http://localhost:8000/appointments/", {
      hospital_id: 1,
      type,
      date
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("예약 완료");
  };

  return (
    <div>
      <h2>비대면 진료 예약</h2>

      <select onChange={(e) => setType(e.target.value)}>
        <option value="video">화상</option>
        <option value="call">전화</option>
        <option value="chat">문자</option>
      </select>

      <input type="datetime-local" onChange={(e)=>setDate(e.target.value)} />

      <button onClick={submit}>예약하기</button>
    </div>
  );
}
