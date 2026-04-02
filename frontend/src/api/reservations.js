import api from './client';

export const createReservation = async (payload) => {
  const response = await api.post('/api/patient/reservations', payload);
  return response.data;
};

export const getReservations = async () => {
  const response = await api.get('/api/patient/reservations');
  return response.data;
};
