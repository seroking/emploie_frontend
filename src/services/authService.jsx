import api from './api'; // ton utilitaire axios ou fetch

export const loginUser = async (email, password) => {
  try {
    const { data } = await api.post('/login', { email, password });
    // data = { message, utilisateur, token }
    // On retourne user et token pour clarté
    return { user: data.utilisateur, token: data.token };
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};


/*
export const register = (userData) => {
    return api.post('/register', userData);
  };
  
export const forgotPassword = (email) => {
    return api.post('/forgot-password', { email });
  };
  */