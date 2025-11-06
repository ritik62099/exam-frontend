import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import Logo from '../../assets/logins.png';

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
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
          padding: 16px;
          box-sizing: border-box;
        }

        .login-card {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 420px;
          box-sizing: border-box;
          text-align: center;
        }

        .logo {
          width: 80px; /* Slightly larger as per your preference */
          height: auto;
          margin-bottom: 16px;
        }

        .login-card h2 {
          text-align: center;
          margin-bottom: 24px;
          font-size: 24px;
          color: #2c3e50;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 18px;
          text-align: left;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #dce2ec;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s, box-shadow 0.3s;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
        }

        .error {
          color: #e74c3c;
          font-size: 14px;
          margin-bottom: 16px;
          text-align: center;
          background: #fdf2f2;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #fecaca;
        }

        .btn {
          width: 100%;
          padding: 12px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .btn:hover:not(:disabled) {
          background: #2980b9;
        }

        .btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .login-card {
            padding: 24px;
          }

          .logo {
            width: 70px;
          }

          .login-card h2 {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="login-card">
        <img src={Logo} alt="Exam System Logo" className="logo" />
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