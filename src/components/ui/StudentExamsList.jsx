import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useActiveExams } from '../../hooks/useActiveExams';
import { useEffect, useState } from 'react';
import api from '../../api/client';

const StudentExamsList = () => {
  const { user } = useAuth();
  const { exams, loading, refetch } = useActiveExams(); // 🔹 Add refetch
  const [attemptedExams, setAttemptedExams] = useState(new Set());
  const navigate = useNavigate();

  // 🔹 Fetch attempted exams
  const fetchAttemptedExams = async () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('⚠️ No token found in localStorage');
      return;
    }

    const res = await fetch(`https://exam-api-1kyg.onrender.com/api/exams/results/${user.username}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ✅ include Bearer prefix
      },
    });

    if (!res.ok) {
      console.error('❌ Failed to fetch results:', res.status);
      return;
    }

    const results = await res.json(); // ✅ parse JSON properly
    const validResults = (results.results || []).filter(r => r.examId); // ✅ filter out null exams
const examIds = new Set(validResults.map(r => r.examId._id || r.examId));

    setAttemptedExams(examIds);
  } catch (err) {
    console.error('Failed to load attempted exams:', err.message);
  }
};


  // 🔹 Initial load
  useEffect(() => {
    fetchAttemptedExams();
  }, [user.username]);

  // 🔹 Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // 🔹 Refresh active exams
      fetchAttemptedExams(); // 🔹 Refresh attempted exams
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user.username, refetch]);

  if (loading) return <p style={{ padding: '1.5rem' }}>Loading exams...</p>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Available Exams</h2>
      {exams.length === 0 ? (
        <p>No exams available at the moment.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {exams.map(exam => {
            const isAttempted = attemptedExams.has(exam._id);
            return (
              <div key={exam._id} style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <h3>{exam.title}</h3>
                <p>Time: {exam.timeLimit} minutes</p>
                <p>Questions: {exam.questions?.length || 0}</p>

                {isAttempted ? (
                  <span style={{
                    padding: '0.5rem 1rem',
                    background: '#e2e8f0',
                    color: '#4a5568',
                    borderRadius: '6px',
                    fontWeight: 'bold'
                  }}>
                    Already Attempted
                  </span>
                ) : (
                  <button
                    onClick={() => navigate(`/student/exam/${exam._id}`)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#4a6cf7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Start Exam
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentExamsList;