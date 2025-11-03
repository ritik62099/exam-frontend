import { useState } from 'react';
import { createExam as createExamAPI } from '../api/examAPI';

export const useCreateExam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createExam = async (examData) => {
    setLoading(true);
    setError(null);
    try {
      await createExamAPI(examData);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createExam, loading, error, success };
};