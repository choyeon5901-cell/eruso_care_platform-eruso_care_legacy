import axios from 'axios';

export const getUser = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token');
  }

  const res = await axios.get('http://localhost:8000/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
