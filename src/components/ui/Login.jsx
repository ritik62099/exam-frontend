import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ username, password });
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          font-family: 'Poppins', sans-serif;
        }

        .login-card {
          background: #fff;
          padding: 2rem 2.5rem;
          border-radius: 1rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 400px;
          text-align: center;
          animation: fadeIn 0.5s ease-in-out;
        }

        h2 {
          margin-bottom: 1.5rem;
          color: #333;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border 0.3s ease;
        }

        input:focus {
          border-color: #2575fc;
          outline: none;
          box-shadow: 0 0 4px rgba(37, 117, 252, 0.3);
        }

        .btn {
          width: 100%;
          padding: 0.9rem;
          background: #2575fc;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s ease;
        }

        .btn:hover {
          background: #1a5edb;
        }

        .btn:disabled {
          background: #aaa;
          cursor: not-allowed;
        }

        .error {
          color: red;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem;
          }

          input, .btn {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="login-card">
        <h2>Exam System Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
