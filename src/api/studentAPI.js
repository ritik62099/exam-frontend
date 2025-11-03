// src/api/studentAPI.js
import api from './client';

export const createStudent = (studentData) => {
  return api('/students', {
    method: 'POST',
    body: JSON.stringify(studentData) // ✅ ye data backend ke `req.body` ban jata hai
  });
};