// src/hooks/useUpdateStudent.js
import { useState } from 'react';
import { updateStudent as updateStudentAPI } from '../api/studentAPI';

export const useUpdateStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateStudent = async (id, payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const data = await updateStudentAPI(id, payload);
      setSuccess(true);
      return { success: true, student: data.student };
    } catch (err) {
      setError(err.message || 'Failed to update student');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { updateStudent, loading, error, success };
};
