import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [list, setList] = useState([]);

  const load = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("http://localhost:8000/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setList(res.data);
  };

  useEffect(()=>{load();},[]);

  return (
    <div>
      <h2>알림</h2>
      {list.map(n=>(
        <div key={n.id}>{n.message}</div>
      ))}
    </div>
  );
}
