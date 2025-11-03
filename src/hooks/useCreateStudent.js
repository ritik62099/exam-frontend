// src/hooks/useCreateStudent.js
import { useState } from 'react';
import { createStudent as createStudentAPI } from '../api/studentAPI';

export const useCreateStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createStudent = async (studentData) => {
    // studentData = { username: "...", password: "..." }
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createStudentAPI(studentData); // ✅ ye frontend se backend bhejta hai
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return { createStudent, loading, error, success };
};