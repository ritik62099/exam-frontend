import { useState, useEffect } from 'react';
import { getExams as getExamsAPI } from '../api/examAPI';

export const useExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExamsAPI();
        if (data.success) {
          setExams(data.exams || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return { exams, loading, error };
};