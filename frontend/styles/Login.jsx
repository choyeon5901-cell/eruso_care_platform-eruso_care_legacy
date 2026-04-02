import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Button, Input, Divider, Alert } from '../components/UI.jsx';
import '../styles/global.css';
import '../styles/components.css';

export default function Login() {
  const [tab, setTab]       = useState('login');
  const [email, setEmail]   = useState('');
  const [pw, setPw]         = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !pw) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    setLoading(true); setError('');

    try {
      if (tab === 'login') {
        const res = await api.post('/auth/login', { email, password: pw });
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } else {
        await api.post('/auth/signup', { email, password: pw });
        setTab('login');
        setError('');
        alert('회원가입 완료! 로그인해주세요.');
      }
    } catch {
      setError(tab === 'login' ? '이메일 또는 비밀번호를 확인해주세요.' : '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--teal-600) 0%, var(--teal-800) 100%)',
        padding: 'var(--space-16) var(--space-6) var(--space-12)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 'var(--radius-2xl)',
          background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
          border: '1.5px solid rgba(255,255,255,0.25)',
        }}>💊</div>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', letterSpacing: '-0.03em' }}>약픽</h1>
          <p style={{ marginTop: 'var(--space-2)', opacity: 0.8, fontSize: 'var(--text-sm)' }}>
            처방약을 미리 예약하고, 빠르게 수령하세요
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        flex: 1, padding: 'var(--space-6)',
        background: 'var(--color-bg-subtle)',
      }}>
        <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
          {/* Tabs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid var(--color-border)',
          }}>
            {['login', 'signup'].map(t => (
              <button key={t}
                onClick={() => { setTab(t); setError(''); }}
                style={{
                  padding: 'var(--space-4)', border: 'none', background: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)',
                  color: tab === t ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent',
                  marginBottom: -1, transition: 'all var(--transition-base)',
                }}
              >
                {t === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {error && <Alert type="danger">⚠️ {error}</Alert>}

            <Input
              label="이메일" type="email" required
              placeholder="example@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              icon={<span style={{ fontSize: 16 }}>✉️</span>}
            />
            <Input
              label="비밀번호" type="password" required
              placeholder="비밀번호를 입력하세요"
              value={pw} onChange={e => setPw(e.target.value)}
              icon={<span style={{ fontSize: 16 }}>🔒</span>}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />

            <Button variant="primary" size="lg" full loading={loading} onClick={handleSubmit}
              style={{ marginTop: 'var(--space-2)' }}>
              {tab === 'login' ? '로그인' : '회원가입'}
            </Button>

            <Divider text="또는" />

            {/* 약국 관리자 로그인 링크 */}
            <button
              onClick={() => navigate('/pharmacy/login')}
              style={{
                background: 'var(--color-bg-muted)', border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                cursor: 'pointer', width: '100%', fontFamily: 'var(--font-sans)',
                transition: 'border-color var(--transition-base)',
              }}
            >
              <span style={{ fontSize: 24 }}>🏥</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>
                  약국 관리자 로그인
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
                  약국 대시보드로 이동
                </div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
