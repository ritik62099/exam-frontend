

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
          /* 🌐 Layout wrapper for centering */
          .form-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: calc(100vh - 100px);
            padding: 1.5rem;
            background: #f9fafb;
          }

          /* 📦 Main container */
          .form-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            width: 100%;
            max-width: 500px;
            box-sizing: border-box;
          }

          .form-container h2 {
            margin-bottom: 1.5rem;
            text-align: center;
            color: #2d3748;
          }

          /* 🧾 Input fields */
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
            transition: border 0.2s ease;
          }

          .form-group input:focus {
            border-color: #4a6cf7;
            outline: none;
          }

          /* 🔘 Buttons */
          .btn-row {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .btn {
            flex: 1;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.2s;
          }

          .btn-primary {
            background: #4a6cf7;
            color: white;
          }

          .btn-primary:hover {
            background: #3b5de0;
          }

          .btn-secondary {
            background: #e2e8f0;
            color: #2d3748;
          }

          .btn-secondary:hover {
            background: #cbd5e0;
          }

          .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          /* ✅ Alert messages */
          .alert {
            padding: 0.75rem;
            margin-top: 1rem;
            border-radius: 6px;
            font-size: 0.95rem;
            text-align: center;
          }

          .alert-success {
            background: #c6f6d5;
            color: #2f855a;
          }

          .alert-error {
            background: #fed7d7;
            color: #c53030;
          }

          /* 📱 Responsive Design */
          @media (max-width: 768px) {
            .form-wrapper {
              padding: 1rem;
            }

            .form-container {
              padding: 1.5rem;
            }

            .btn-row {
              flex-direction: column;
            }

            .btn {
              width: 100%;
              font-size: 1rem;
            }
          }

          @media (max-width: 480px) {
            .form-container {
              padding: 1.2rem;
              border-radius: 8px;
            }

            .form-group label {
              font-size: 0.9rem;
            }

            .form-group input {
              font-size: 0.9rem;
              padding: 0.65rem;
            }

            .btn {
              font-size: 0.9rem;
              padding: 0.65rem;
            }
          }
        `}
      </style>

      <div className="form-wrapper">
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
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && (
              <div className="alert alert-success">
                Student created successfully! Redirecting...
              </div>
            )}

            <div className="btn-row">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Creating...' : 'Create Student'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddStudentForm;
