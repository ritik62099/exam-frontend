import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const ExamAttemptForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exam
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await api(`/exams/${id}`, { method: 'GET' });
         console.log('Fetched exam data:', data); 
        if (data.success) {
          setExam(data.exam);
          setAnswers(Array(data.exam.questions.length).fill(null));
          setTimeLeft(data.exam.timeLimit * 60); // in seconds
        }
      } catch (err) {
        setError('Failed to load exam');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 && exam) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, exam]);

  const handleAnswerSelect = (qIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      const examData = {
        examId: id,
        studentUsername: user.username,
        answers: answers.map((selectedOption, questionIndex) => ({
          questionIndex,
          selectedOption
        }))
      };

      const result = await api('/exams/submit', {
        method: 'POST',
        body: JSON.stringify(examData)
      });

      // Redirect to result page (you can pass result in state or refetch)
      navigate(`/student/result/${id}`, { state: { result: result.result } });
    } catch (err) {
      alert('Submission error: ' + err.message);
      setSubmitted(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading exam...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!exam) return <div>Exam not found</div>;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        background: '#f8fafc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>{exam.title}</h2>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: timeLeft < 300 ? 'red' : 'green' }}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      {exam.questions.map((q, qIndex) => (
        <div key={qIndex} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3>Q{qIndex + 1}. {q.text}</h3>
          <div style={{ marginTop: '1rem' }}>
            {q.options.map((option, optIndex) => (
              <div key={optIndex} style={{ marginBottom: '0.5rem' }}>
                <label>
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={answers[qIndex] === optIndex}
                    onChange={() => handleAnswerSelect(qIndex, optIndex)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {String.fromCharCode(65 + optIndex)}. {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitted}
        style={{
          padding: '0.75rem 2rem',
          background: '#4a6cf7',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1.1rem',
          cursor: submitted ? 'not-allowed' : 'pointer'
        }}
      >
        {submitted ? 'Submitting...' : 'Submit Exam'}
      </button>
    </div>
  );
};

export default ExamAttemptForm;