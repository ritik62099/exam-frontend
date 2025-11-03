import api from './client';

export const createExam = (examData) => api('/exams', { method: 'POST', body: JSON.stringify(examData) });
export const getExams = () => api('/exams', { method: 'GET' });
export const updateExam = (id, examData) => api(`/exams/${id}`, { method: 'PUT', body: JSON.stringify(examData) });
export const deleteExam = (id) => api(`/exams/${id}`, { method: 'DELETE' });
export const getActiveExams = () => api('/exams/active', { method: 'GET' });
export const submitExam = (examData) => api('/exams/submit', { method: 'POST', body: JSON.stringify(examData) });
export const getStudentResults = (username) => api(`/exams/results/${username}`, { method: 'GET' });
