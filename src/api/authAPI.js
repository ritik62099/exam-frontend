import api from './client';

export const login = (credentials) => {
  return api('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};