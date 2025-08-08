//Configuração para poder utilizar a API de forma simples, só chamar api.get() por exemplo

import axios from 'axios';

const api = axios.create({
  baseURL: "https://backend-adopt.onrender.com" //https://backend-adopt.onrender.com/
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});


export default api;