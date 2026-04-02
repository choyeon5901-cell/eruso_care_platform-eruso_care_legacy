import React, { useState } from 'react';
import AppHeader from '../components/AppHeader';
import theme from '../styles/theme';

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: '홍길동',
    userId: 'hong123',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    address: '대전광역시 서구 둔산동',
  });

  const changeValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    alert('내정보 수정이 저장되었습니다. 다음 단계에서 API 연동 예정입니다.');
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
      <AppHeader title="내정보" />

      <div style={{ padding: 18 }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 22,
            padding: 18,
            boxShadow: theme.shadow.soft,
          }}
        >
          <Field
            label="이름"
            value={form.name}
            onChange={(v) => changeValue('name', v)}
          />
          <Field
            label="아이디"
            value={form.userId}
            onChange={(v) => changeValue('userId', v)}
          />
          <Field
            label="이메일"
            value={form.email}
            onChange={(v) => changeValue('email', v)}
          />
          <Field
            label="전화번호"
            value={form.phone}
            onChange={(v) => changeValue('phone', v)}
          />
          <Field
            label="주소"
            value={form.address}
            onChange={(v) => changeValue('address', v)}
          />

          <button
            onClick={handleSave}
            style={{
              width: '100%',
              border: 'none',
              borderRadius: 16,
              padding: '15px 16px',
              background: 'linear-gradient(135deg, #2F80ED, #56CCF2)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{ marginBottom: 8, fontWeight: 700, color: theme.colors.text }}
      >
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 14,
          border: `1px solid ${theme.colors.border}`,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
