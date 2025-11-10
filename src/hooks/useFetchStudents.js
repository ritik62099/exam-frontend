// // src/hooks/useFetchStudents.js
// import { useState, useEffect } from 'react';
// import api from '../api/client';

// export const useFetchStudents = () => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const data = await api('/students', { method: 'GET' });
//         if (data.success) {
//           setStudents(data.students || []);
//         }
//       } catch (err) {
//         setError(err.message || 'Failed to load students');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStudents();
//   }, []);

//   return { students, loading, error };
// };

// src/hooks/useFetchStudents.js
import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

export const useFetchStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api('/students', { method: 'GET' });
      if (data.success) {
        setStudents(data.students || []);
      } else {
        setError(data.message || 'Failed to load students');
      }
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return { students, loading, error, refetch: fetchStudents };
};
