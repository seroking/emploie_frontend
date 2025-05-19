import API from '../services/api';

export async function loginUser(email, password) {
  const response = await API.post('/login', { email, password });
  const { utilisateur, token } = response.data;
  return { user: utilisateur, token };
}