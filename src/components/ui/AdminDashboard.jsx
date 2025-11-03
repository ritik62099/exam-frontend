// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useCreateStudent } from '../../hooks/useCreateStudent';
import { useFetchStudents } from '../../hooks/useFetchStudents';

const AdminDashboard = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { createStudent, loading: creating, error: createError, success } = useCreateStudent();
  const { students, loading: fetching, error: fetchError } = useFetchStudents();

  const handleSubmit = (e) => {
    e.preventDefault();
    createStudent({ username, password });
  };

  useEffect(() => {
    if (success) {
      setUsername('');
      setPassword('');
    }
  }, [success]);

  return (
    <>
      <style>
        {`
          .dashboard-section {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            margin-bottom: 1.5rem;
          }
          .form-row {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          .form-row input {
            flex: 1;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
          }
          .btn {
            padding: 0.75rem 1.5rem;
            background: #4a6cf7;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
          }
          .btn:disabled {
            background: #cccccc;
            cursor: not-allowed;
          }
          .students-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }
          .students-table th,
          .students-table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          .students-table th {
            background: #f8fafc;
            font-weight: 600;
          }
          .error { color: #e53e3e; margin: 0.5rem 0; }
          .success { color: #38a169; margin: 0.5rem 0; }
        `}
      </style>

      <div className="dashboard-section">
        <h2>Add New Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Student Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Student Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={creating} className="btn">
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
          {createError && <div className="error">{createError}</div>}
          {success && <div className="success">Student created successfully!</div>}
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Students ({students.length})</h2>
        {fetchError && <div className="error">{fetchError}</div>}
        {fetching ? (
          <p>Loading students...</p>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center' }}>No students found</td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={index}>
                    <td>{student.username}</td>
                    <td>{student.plainPassword || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;