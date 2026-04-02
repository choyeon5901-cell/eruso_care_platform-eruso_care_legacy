import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { login } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const result = await login({ loginId, password });

      if (result.success) {
        await Preferences.set({
          key: "token",
          value: result.data.token,
        });

        await Preferences.set({
          key: "user",
          value: JSON.stringify(result.data.user),
        });

        alert("로그인 성공");
        navigate("/home");
      } else {
        alert(result.message || "로그인 실패");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>로그인</h2>

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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          style={{ width: "250px", padding: "8px" }}
        />
      </div>

      <button onClick={handleLogin} style={{ padding: "8px 16px" }}>
        로그인
      </button>
    </div>
  );
}