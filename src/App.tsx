import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import StudentPage from './pages/StudentPage';
import AddStudentPage from './pages/AddStudentPage';
import CreateExamPage from './pages/CreateExamPage';
import ExamsPage from './pages/ExamsPage';
import EditExamPage from './pages/EditExamPage';
import ExamPage from './pages/ExamPage'
import ResultPage from './pages/ResultPage'
import StudentResultsPage from './pages/StudentResultsPage'
import AdminResultsPage from './pages/AdminResultsPage'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add-student"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddStudentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/edit-exam/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exams"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ExamsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-exam"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CreateExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/student/exam/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/result/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ResultPage />
              </ProtectedRoute>
            }
          />

// Student
          <Route
            path="/student/results"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentResultsPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin/results"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminResultsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;