// // src/api/studentAPI.js
// import api from './client';

// export const createStudent = (studentData) => {
//   return api('/students', {
//     method: 'POST',
//     body: JSON.stringify(studentData) // ✅ ye data backend ke `req.body` ban jata hai
//   });
// };

// src/api/studentAPI.js
import api from './client';

export const createStudent = (studentData) => {
  return api('/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  });
};

export const updateStudent = (id, studentData) => {
  return api(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData),
  });
};

export const deleteStudent = (id) => {
  return api(`/students/${id}`, {
    method: 'DELETE',
  });
};
