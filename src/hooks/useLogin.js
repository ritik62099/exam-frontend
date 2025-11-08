// import { useState } from 'react';
// import { login as loginAPI } from '../api/authAPI';
// import { useAuth } from '../context/AuthContext';

// export const useLogin = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { login } = useAuth();

//   const loginFn = async (credentials) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await loginAPI(credentials);
//       if (data.success) {
//         login({
//           token: data.token || 'dummy-token',
//           role: data.role,
//           username: credentials.username
//         });
//       } else {
//         setError(data.message || 'Invalid credentials');
//       }
//     } catch (err) {
//       setError(err.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { login: loginFn, loading, error };
// };

import { useState } from 'react';
import { login as loginAPI } from '../api/authAPI';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const loginFn = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginAPI(credentials);
      console.log('🔹 Login response:', data); // helpful for debugging

      if (data.success && data.token) {
        login({
          token: data.token, // ✅ store real JWT only
          role: data.role,
          username: credentials.username,
          registrationNumber: data.registrationNumber
        });
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return { login: loginFn, loading, error };
};
