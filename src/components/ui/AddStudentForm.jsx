// src/components/AddStudentForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateStudent } from '../../hooks/useCreateStudent';

const AddStudentForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { createStudent, loading, error, success } = useCreateStudent();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    createStudent({ username, password });
  };

  // On success, redirect to /admin after short delay
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/admin');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <>
      <style>
        {`
          .form-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            max-width: 500px;
          }
          .form-group {
            margin-bottom: 1.25rem;
          }
          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #2d3748;
          }
          .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            box-sizing: border-box;
          }
          .btn-row {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
          }
          .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
          }
          .btn-primary {
            background: #4a6cf7;
            color: white;
          }
          .btn-secondary {
            background: #e2e8f0;
            color: #2d3748;
          }
          .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .alert {
            padding: 0.75rem;
            margin-top: 1rem;
            border-radius: 6px;
          }
          .alert-success {
            background: #c6f6d5;
            color: #2f855a;
          }
          .alert-error {
            background: #fed7d7;
            color: #c53030;
          }
        `}
      </style>

      <div className="form-container">
        <h2>Add New Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">Student created successfully! Redirecting...</div>}

          <div className="btn-row">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Student'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddStudentForm;