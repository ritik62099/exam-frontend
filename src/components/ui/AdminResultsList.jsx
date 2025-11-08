

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

  const handleReattempt = async (examId, studentUsername) => {
    if (
      !window.confirm(
        `Allow ${studentUsername} to re-attempt this exam? Their current result will be deleted.`
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'https://exam-api-1kyg.onrender.com/api/exams/results',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ examId, studentUsername }),
        }
      );

      if (response.ok) {
        alert('Result deleted. Student can now re-attempt the exam.');

        const getResponse = await fetch(
          'https://exam-api-1kyg.onrender.com/api/exams/results',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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

  const filteredResults = results.filter((result) =>
    result.studentUsername.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: '2rem' }}>Loading results...</div>;

  return (
    <>
      <style>{`
        .results-page {
          padding: 1.5rem;
        }

        .results-page h2 {
          margin-bottom: 1.5rem;
          color: #2d3748;
        }

        .search-box {
          margin-bottom: 1.5rem;
        }

        .search-box input {
          width: 300px;
          max-width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          box-sizing: border-box;
          transition: border 0.2s ease;
        }

        .search-box input:focus {
          border-color: #4a6cf7;
          outline: none;
        }

        /* 🖥 Desktop Table */
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
          font-size: 0.95rem;
        }

        .results-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #2d3748;
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
          transition: background 0.2s ease;
        }

        .reattempt-btn {
          background: #38a169;
          color: white;
        }

        .reattempt-btn:hover {
          background: #2f855a;
        }

        /* 📱 Mobile Card View */
        .results-cards {
          display: none;
        }

        @media (max-width: 768px) {
          .results-table {
            display: none;
          }

          .results-cards {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .result-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            padding: 1rem;
          }

          .result-card h3 {
            margin: 0 0 0.5rem;
            font-size: 1.05rem;
            color: #2d3748;
          }

          .result-info {
            font-size: 0.9rem;
            color: #4a5568;
            margin-bottom: 0.3rem;
          }

          .result-actions {
            margin-top: 0.75rem;
          }

          .result-actions button {
            width: 100%;
            padding: 0.6rem;
            font-size: 0.9rem;
            border-radius: 6px;
          }
        }

        @media (max-width: 480px) {
          .results-page {
            padding: 1rem;
          }

          .result-card {
            padding: 0.9rem;
          }

          .result-card h3 {
            font-size: 1rem;
          }

          .result-info {
            font-size: 0.85rem;
          }

          .result-actions button {
            font-size: 0.85rem;
            padding: 0.5rem;
          }
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

        {/* 🖥 Desktop Table */}
        {filteredResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <>
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
                {filteredResults.map((result) => (
                  <tr key={result._id}>
                    <td>{result.studentUsername}</td>
                    <td>{result.examId?.title || 'N/A'}</td>
                    <td>
                      {result.score} / {result.totalMarks}
                    </td>
                    <td>
                      {((result.score / result.totalMarks) * 100).toFixed(2)}%
                    </td>
                    <td>
                      {new Date(result.submittedAt).toLocaleString('en-GB')}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn reattempt-btn"
                        onClick={() =>
                          handleReattempt(
                            result.examId?._id || result.examId,
                            result.studentUsername
                          )
                        }
                      >
                        Re-attempt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 📱 Mobile Cards */}
            <div className="results-cards">
              {filteredResults.map((result) => (
                <div className="result-card" key={result._id}>
                  <h3>{result.examId?.title || 'N/A'}</h3>
                  <div className="result-info">
                    <strong>Student:</strong> {result.studentUsername}
                  </div>
                  <div className="result-info">
                    <strong>Score:</strong> {result.score} / {result.totalMarks}
                  </div>
                  <div className="result-info">
                    <strong>Percentage:</strong>{' '}
                    {((result.score / result.totalMarks) * 100).toFixed(2)}%
                  </div>
                  <div className="result-info">
                    <strong>Submitted:</strong>{' '}
                    {new Date(result.submittedAt).toLocaleString('en-GB')}
                  </div>

                  <div className="result-actions">
                    <button
                      className="action-btn reattempt-btn"
                      onClick={() =>
                        handleReattempt(
                          result.examId?._id || result.examId,
                          result.studentUsername
                        )
                      }
                    >
                      Re-attempt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminResultsList;
