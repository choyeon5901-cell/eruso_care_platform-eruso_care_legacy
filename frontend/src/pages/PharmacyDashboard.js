import { useEffect, useState } from "react";
import axios from "axios";

export default function PharmacyDashboard() {
  const [list, setList] = useState([]);

  const load = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:8000/appointments/pharmacy", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setList(res.data);
  };

  useEffect(()=>{load();},[]);

  return (
    <div>
      <h2>약국 관리</h2>
      {list.map(a=>(
        <div key={a.id}>
          <div>{a.user_id}</div>
          <div>{a.status}</div>
        </div>
      ))}
    </div>
  );
}
