// src/components/StudentList.jsx
import { useNavigate } from 'react-router-dom';
import { useFetchStudents } from '../../hooks/useFetchStudents';

const StudentList = () => {
  const { students, loading, error } = useFetchStudents();
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }
          .btn {
            padding: 0.5rem 1rem;
            background: #4a6cf7;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.95rem;
          }
          .dashboard-section {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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
        `}
      </style>

      <div className="dashboard-section">
        <div className="page-header">
          <h2>Students ({students.length})</h2>
          <button className="btn" onClick={() => navigate('/admin/add-student')}>
            + Add Student
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {loading ? (
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

export default StudentList;