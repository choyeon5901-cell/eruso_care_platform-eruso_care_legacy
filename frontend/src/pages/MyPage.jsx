import { useNavigate } from 'react-router-dom';
import { logout } from '../api/session';

export default function MyPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>마이페이지</h2>
      <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
        로그아웃
      </button>
    </div>
  );
}
