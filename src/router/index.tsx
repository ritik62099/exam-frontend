// src/router/index.tsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/Login';
import AdminLayout from '../pages/admin/AdminLayout';
import StudentLayout from '../pages/student/StudentLayout';
import Dashboard from '../pages/admin/Dashboard';
import Students from '../pages/admin/Students';
import Exams from '../pages/admin/Exams';
import Results from '../pages/admin/Results';
import StudentDashboard from '../pages/student/Dashboard';
import ExamTake from '../pages/student/ExamTake';
import Result from '../pages/student/Result';
import ExamCreate from '../pages/admin/ExamCreate';
import { useEffect } from 'react';

// Guard Component for Protected Routes
const ProtectedRoute = ({
  children,
  allowedRoles
}: {
  children: JSX.Element;
  allowedRoles: ('admin' | 'student')[];
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While checking auth
  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  // If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user role is not allowed → redirect to their own dashboard
  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

// Main Router
const Router = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="exams" element={<Exams />} />
        <Route path="exams/create" element={<ExamCreate />} />
        <Route path="exams/edit/:id" element={<ExamCreate />} />
        <Route path="results" element={<Results />} />
        <Route path="results/:attemptId" element={<Result />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="exam/:attemptId" element={<ExamTake />} />
        <Route path="result/:attemptId" element={<Result />} />
        
      </Route>

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['admin', 'student']}>
            <RootRedirect />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect to login if unauthenticated, else to role dashboard */}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
};

// Helper: Redirect root based on role
const RootRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

// Helper: Handle 404 or invalid routes
const NotFoundRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard
  return user.role === 'admin' ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/student/dashboard" replace />
  );
};

export default Router;