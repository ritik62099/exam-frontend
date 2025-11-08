import { useEffect, useState } from 'react';
import api from '../../api/client';

const AdminResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        const data = await api('/exams/results', { method: 'GET' });
        setResults(data.results || []);
      } catch (err) {
        console.error('Fetch results error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllResults();
  }, []);

  // 🔹 Re-attempt function
  const handleReattempt = async (examId, studentUsername) => {
  if (
    !window.confirm(
      `Are you sure you want to allow ${studentUsername} to re-attempt this exam? Their current result will be deleted.`
    )
  ) {
    return;
  }

  try {
    const token = localStorage.getItem('token');

    // ✅ Include Bearer in Authorization header
    const response = await fetch('https://exam-api-1kyg.onrender.com/api/exams/results', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ FIXED
      },
      body: JSON.stringify({ examId, studentUsername }),
    });

    if (response.ok) {
      alert('Result deleted. Student can now re-attempt the exam.');

      // ✅ Fetch updated results with Bearer header
      const getResponse = await fetch('https://exam-api-1kyg.onrender.com/api/exams/results', {
        headers: { Authorization: `Bearer ${token}` }, // ✅ FIXED
      });

      const data = await getResponse.json();
      setResults(data.results || []);
    } else {
      const err = await response.json();
      alert('Failed to delete result: ' + (err.message || 'Unknown error'));
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};


  const filteredResults = results.filter(result =>
    result.studentUsername.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: '2rem' }}>Loading results...</div>;

  return (
    <>
      <style>{`
        .results-page { padding: 1.5rem; }
        .search-box { margin-bottom: 1.5rem; }
        .search-box input {
          width: 300px;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }
        .results-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .results-table th,
        .results-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .results-table th {
          background: #f8fafc;
          font-weight: 600;
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
        .reattempt-btn { 
          background: #38a169; 
          color: white; 
        }
      `}</style>

      <div className="results-page">
        <h2>All Results</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by student username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <table className="results-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Submitted At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map(result => (
                <tr key={result._id}>
                  <td>{result.studentUsername}</td>
                  <td>{result.examId?.title || 'N/A'}</td>
                  <td>{result.score} / {result.totalMarks}</td>
                  <td>{((result.score / result.totalMarks) * 100).toFixed(2)}%</td>
                  <td>{new Date(result.submittedAt).toLocaleString('en-GB')}</td>
                  <td className="actions-cell">
                    <button
                      className="action-btn reattempt-btn"
                      onClick={() => handleReattempt(result.examId?._id || result.examId, result.studentUsername)}
                    >
                      Re-attempt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminResultsList;