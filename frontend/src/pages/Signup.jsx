import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const result = await signup({
        loginId,
        name,
        password,
        role: "patient",
      });

      if (result.success) {
        alert("회원가입 성공");
        navigate("/login");
      } else {
        alert(result.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>회원가입</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          placeholder="아이디"
          style={{ width: "250px", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          style={{ width: "250px", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          style={{ width: "250px", padding: "8px" }}
        />
      </div>

      <button onClick={handleSignup} style={{ padding: "8px 16px" }}>
        회원가입
      </button>
    </div>
  );
}