import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

console.log('client.js 로드됨');

const api = axios.create({
  baseURL: 'http://localhost:8000', // 🔥 이걸로
});

api.interceptors.request.use(
  async (config) => {
    console.log('axios 요청 직전', config.url);

    const { value } = await Preferences.get({ key: 'token' });
    if (value) {
      config.headers.Authorization = `Bearer ${value}`;
    }

    return config;
  },
  (error) => {
    console.error('axios request interceptor 오류', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log('axios 응답 성공', response);
    return response;
  },
  (error) => {
    console.error('axios 응답 오류', error);
    console.error('axios 응답 오류 data', error?.response?.data);
    return Promise.reject(error);
  },
);

export default api;
