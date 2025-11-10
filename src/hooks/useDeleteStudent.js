// src/hooks/useDeleteStudent.js
import { useState } from 'react';
import { deleteStudent as deleteStudentAPI } from '../api/studentAPI';

export const useDeleteStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteStudent = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteStudentAPI(id);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete student');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { deleteStudent, loading, error };
};
