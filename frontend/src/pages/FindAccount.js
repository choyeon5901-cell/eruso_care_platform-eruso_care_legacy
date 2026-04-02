import React, { useState } from 'react';
import AppHeader from '../components/AppHeader';
import theme from '../styles/theme';

export default function FindAccount() {
  const [findIdName, setFindIdName] = useState('');
  const [findIdPhone, setFindIdPhone] = useState('');
  const [findPwId, setFindPwId] = useState('');
  const [findPwPhone, setFindPwPhone] = useState('');

  const handleFindId = () => {
    alert('아이디 찾기 기능은 추후 본인인증 API와 연동됩니다.');
  };

  const handleResetPassword = () => {
    alert('비밀번호 찾기 기능은 추후 본인인증/이메일 연동됩니다.');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background,
        maxWidth: theme.layout.maxWidth,
        margin: '0 auto',
      }}
    >
      <AppHeader title="계정 찾기" />

      <div style={{ padding: 18 }}>
        <div style={cardStyle}>
          <div style={titleStyle}>아이디 찾기</div>
          <input
            placeholder="이름"
            value={findIdName}
            onChange={(e) => setFindIdName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="전화번호"
            value={findIdPhone}
            onChange={(e) => setFindIdPhone(e.target.value)}
            style={{ ...inputStyle, marginTop: 12 }}
          />
          <button onClick={handleFindId} style={buttonStyle}>
            아이디 찾기
          </button>
        </div>

        <div style={cardStyle}>
          <div style={titleStyle}>비밀번호 찾기</div>
          <input
            placeholder="아이디"
            value={findPwId}
            onChange={(e) => setFindPwId(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="전화번호"
            value={findPwPhone}
            onChange={(e) => setFindPwPhone(e.target.value)}
            style={{ ...inputStyle, marginTop: 12 }}
          />
          <button onClick={handleResetPassword} style={buttonStyle}>
            비밀번호 재설정
          </button>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  borderRadius: 22,
  padding: 18,
  boxShadow: theme.shadow.soft,
  marginBottom: 16,
};

const titleStyle = {
  fontSize: 18,
  fontWeight: 800,
  color: theme.colors.text,
  marginBottom: 14,
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 14,
  border: `1px solid ${theme.colors.border}`,
  outline: 'none',
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  border: 'none',
  borderRadius: 14,
  padding: '14px 16px',
  background: theme.colors.primary,
  color: '#fff',
  fontWeight: 800,
  marginTop: 14,
  cursor: 'pointer',
};
