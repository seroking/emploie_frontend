import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,                // utile si tu veux envoyer des cookies
  headers: {
    Accept: 'application/json',         // on s’assure de toujours demander du JSON
    'Content-Type': 'application/json'  // on précise aussi le Content-Type
  },
});

// On relit systématiquement le token au moment de chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    // on force la bonne casse et on utilise bracket notation
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Gestion automatique des erreurs d’auth
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const err = error.response?.data?.error;

    if (status === 401 || err === 'token not Provided') {
      // Clear credentials and redirect to login
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/') {
        window.location.href = '/'; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);

export default API;
