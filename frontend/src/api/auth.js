import api from './client';

export const signup = async ({ loginId, name, password, role = 'patient' }) => {
  console.log('auth.js signup 진입');

  const response = await api.post('/api/auth/signup', {
    loginId,
    name,
    password,
    role,
  });

  console.log('auth.js signup 응답', response);
  return response.data;
};

export const login = async ({ loginId, password }) => {
  const response = await api.post('/api/auth/login', {
    loginId,
    password,
  });
  return response.data;
};
