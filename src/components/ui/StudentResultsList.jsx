import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const StudentResultsList = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api(`/exams/results/${user.username}`, { method: 'GET' });
        setResults(data.results || []);
      } catch (err) {
        console.error('Fetch results error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user.username]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading results...</div>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>My Results</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {results.map(result => (
            <div key={result._id} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h3>{result.examId?.title || 'Exam'}</h3>
              <p>Score: <strong>{result.score} / {result.totalMarks}</strong></p>
              <p>Percentage: <strong>{((result.score / result.totalMarks) * 100).toFixed(2)}%</strong></p>
              <p>Submitted: {new Date(result.submittedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResultsList;