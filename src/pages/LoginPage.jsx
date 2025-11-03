// src/pages/LoginPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../components/ui/Login';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Agar pehle se logged in hai, toh redirect karo
  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'student') {
        navigate('/student');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }

  return <Login />;
};

export default LoginPage;