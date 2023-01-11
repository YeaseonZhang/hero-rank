import axios from 'axios';
import auth from '../../auth.json' assert { type: 'json' };

const baseURL = 'https://kohcamp.qq.com';

export const kohRequest = axios.create({
  baseURL,
});

kohRequest.interceptors.request.use(
  (config) => {
    const { userId, token } = auth;
    config.headers.token = token;
    config.headers.userId = userId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

kohRequest.interceptors.response.use(
  (response) => {
    const { status, data } = response;
    if (status === 200) {
      return { data };
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    return Promise.reject(error.response);
  }
);
