// import { API_BASE_URL } from '../utils/constants';

// const api = async (endpoint, options = {}) => {
//   const config = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers
//     },
//     ...options
//   };

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || 'Something went wrong');
//   }
//   return response.json();
// };

// export default api;
// src/api/client.js
import { API_BASE_URL } from '../utils/constants';

const api = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api${endpoint}`; // ✅ adds /api automatically
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    ...options,
    // headers: {
    //   'Content-Type': 'application/json',
    //   ...(options.headers || {}),
    // },

     headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
};

export default api;
