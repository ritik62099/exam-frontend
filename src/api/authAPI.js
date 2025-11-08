import { API_BASE_URL } from '../utils/constants';

// ⚠️ Do NOT use api() here — call fetch directly
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data; // { success, token, role, username, ... }
};
