import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

export const useActiveExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api('/exams/active', { method: 'GET' });
      setExams(data.exams || []);
    } catch (err) {
      setError(err.message || 'Failed to load exams');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  return { exams, loading, error, refetch: fetchExams }; // 🔹 Return refetch
};