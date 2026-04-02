import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

export default function Signup() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    console.log('회원가입 버튼 클릭됨');

    if (!loginId || !name || !password) {
      alert('아이디, 이름, 비밀번호를 모두 입력하세요.');
      return;
    }

    try {
      setLoading(true);

      console.log('signup 호출 직전', {
        loginId,
        name,
        password,
        role: 'patient',
      });

      const result = await signup({
        loginId,
        name,
        password,
        role: 'patient',
      });

      console.log('회원가입 응답:', result);

      if (result.success) {
        alert('회원가입 성공');
        navigate('/login');
      } else {
        alert(result.message || '회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      console.error('회원가입 응답:', error?.response?.data);

      alert(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          JSON.stringify(error?.response?.data) ||
          error.message ||
          '회원가입 중 오류가 발생했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>회원가입</h2>

      <div style={{ marginBottom: '10px' }}>
        <input
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          placeholder="아이디"
          style={{ width: '250px', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          style={{ width: '250px', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          style={{ width: '250px', padding: '8px' }}
        />
      </div>

      <button
        onClick={handleSignup}
        disabled={loading}
        style={{ padding: '8px 16px' }}
      >
        {loading ? '처리 중...' : '회원가입'}
      </button>
    </div>
  );
}
