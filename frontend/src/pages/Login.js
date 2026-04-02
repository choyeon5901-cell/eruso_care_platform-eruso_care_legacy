import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginId.trim() || !password.trim()) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    console.log('🔥 보내는 값:', {
      loginId,
      password,
    });

    try {
      const res = await axios({
        method: 'post',
        url: 'http://localhost:8000/api/auth/login',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          loginId: loginId,
          password: password,
        },
      });

      console.log('🔥 로그인 응답:', res.data);

      const token = res.data?.access_token || res.data?.token;

      if (!token) {
        alert('로그인 실패');
        return;
      }

      localStorage.setItem('token', token);

      alert('로그인 성공 🎉');

      navigate('/home');
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          JSON.stringify(err.response?.data),
      );
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2 style={{ marginBottom: 20 }}>로그인</h2>

        <form onSubmit={handleLogin}>
          <input
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="아이디"
            style={inputStyle}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            style={{ ...inputStyle, marginTop: 10 }}
          />

          <button type="submit" style={buttonStyle}>
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

// 스타일
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#f5f7fb',
};

const boxStyle = {
  width: 320,
  padding: 30,
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: 8,
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  marginTop: 15,
  background: '#2F80ED',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontWeight: 'bold',
  cursor: 'pointer',
};
