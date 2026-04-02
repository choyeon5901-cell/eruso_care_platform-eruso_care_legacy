import { useState } from "react";
import { signup } from "../api/auth";

export default function SignupPage() {
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
      } else {
        alert(result.message || "회원가입 실패");
      }
    } catch (error) {
      console.error(error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <input
        value={loginId}
        onChange={(e) => setLoginId(e.target.value)}
        placeholder="아이디"
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button onClick={handleSignup}>회원가입</button>
    </div>
  );
}