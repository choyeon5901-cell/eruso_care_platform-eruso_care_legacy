import { useEffect, useState } from 'react';
import { getStoredUser } from '../api/session';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getStoredUser();
      setUser(storedUser);
    };
    loadUser();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>홈</h2>
      {user && (
        <div>
          <p>이름: {user.name}</p>
          <p>역할: {user.role}</p>
        </div>
      )}
    </div>
  );
}
