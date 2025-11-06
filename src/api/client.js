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

import { API_BASE_URL } from '../utils/constants';

const api = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}/api${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default api;
