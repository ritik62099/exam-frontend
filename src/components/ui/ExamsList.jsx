

import { useNavigate } from 'react-router-dom';
import { useExams } from '../../hooks/useExams';

const ExamsList = () => {
  const { exams, loading, error } = useExams();
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/admin/edit-exam/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        const response = await fetch(`https://exam-api-1kyg.onrender.com/api/exams/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          window.location.reload();
        } else {
          alert('Failed to delete exam');
        }
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  // 🔹 Publish/Unpublish functions
  const handlePublish = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://exam-api-1kyg.onrender.com/api/exams/${id}/publish`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Publish failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUnpublish = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://exam-api-1kyg.onrender.com/api/exams/${id}/unpublish`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Unpublish failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <>
      <style>
        {`
          .exams-page {
            padding: 1.5rem;
          }
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
          .exams-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          .exams-table th,
          .exams-table td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          .exams-table th {
            background: #f8fafc;
            font-weight: 600;
            color: #2d3748;
          }
          .exams-table tr:last-child td {
            border-bottom: none;
          }
          .actions-cell {
            display: flex;
            gap: 0.5rem;
          }
          .action-btn {
            padding: 0.35rem 0.75rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
          }
          .edit-btn { background: #3182ce; color: white; }
          .delete-btn { background: #e53e3e; color: white; }
          .publish-btn { background: #38a169; color: white; }
          .unpublish-btn { background: #e53e3e; color: white; }
          .status-published { color: #38a169; font-weight: bold; }
          .status-unpublished { color: #e53e3e; }
          .error { color: #e53e3e; margin: 1rem 0; }
        `}
      </style>

      <div className="exams-page">
        <div className="page-header">
          <h2>Exams ({exams.length})</h2>
          <button className="btn" onClick={() => navigate('/admin/create-exam')}>
            + Create Exam
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <p>Loading exams...</p>
        ) : (
          <table className="exams-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Scheduled At</th>
                <th>Time (min)</th>
                <th>Questions</th>
                <th>Status</th> {/* 🔹 NEW COLUMN */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No exams created yet
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam._id}>
                    <td>{exam.title}</td>
                    <td>
                      {(() => {
                        const date = new Date(exam.scheduledAt);
                        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                        return localDate.toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                      })()}
                    </td>

                    <td>{exam.timeLimit}</td>
                    <td>{exam.questions?.length || 0}</td>
                    <td>
                      {exam.isPublished ? (
                        <span className="status-published">Published</span>
                      ) : (
                        <span className="status-unpublished">Unpublished</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(exam._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(exam._id)}
                      >
                        Delete
                      </button>
                      {exam.isPublished ? (
                        <button
                          className="action-btn unpublish-btn"
                          onClick={() => handleUnpublish(exam._id)}
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          className="action-btn publish-btn"
                          onClick={() => handlePublish(exam._id)}
                        >
                          Publish
                        </button>
                      )}
                    </td>
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

export default ExamsList;