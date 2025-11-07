

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditExamForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [positiveMarking, setPositiveMarking] = useState(1);
  const [negativeMarking, setNegativeMarking] = useState(0);
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationHours, setDurationHours] = useState(24);
  const [showResults, setShowResults] = useState(true);
  const [isPublished, setIsPublished] = useState(false); // 🔹 NEW
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`https://exam-api-1kyg.onrender.com/api/exams/${id}`);
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Exam not found or server error');
        }

        const data = await res.json();
        if (data.success && data.exam) {
          const exam = data.exam;
          setTitle(exam.title);
          setTimeLimit(exam.timeLimit);
          setMarksPerQuestion(exam.marksPerQuestion);
          setPositiveMarking(exam.positiveMarking);
          setNegativeMarking(exam.negativeMarking);
          
          const scheduledDate = new Date(exam.scheduledAt);
          setScheduledAt(scheduledDate.toISOString().slice(0, 16));

          setDurationHours(exam.durationHours || 24);
          setShowResults(exam.showResults !== false);
          setIsPublished(exam.isPublished || false); // 🔹 Load publish status

          setQuestions(
            exam.questions.map(q => ({
              text: q.text,
              options: Array.isArray(q.options) 
                ? q.options 
                : (q.options?.map(opt => opt.text) || ['', '', '', '']),
              correctAnswerIndex: q.correctAnswerIndex
            }))
          );
        } else {
          throw new Error(data.message || 'Exam not found');
        }
      } catch (err) {
        setError(err.message);
        console.error('Fetch exam error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExam();
  }, [id]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const setCorrectAnswer = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswerIndex = optIndex;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const totalMarks = questions.length * parseFloat(marksPerQuestion);

    try {
      const examData = {
        title: title.trim(),
        timeLimit: parseInt(timeLimit, 10),
        totalMarks,
        marksPerQuestion: parseFloat(marksPerQuestion),
        positiveMarking: parseFloat(positiveMarking),
        negativeMarking: parseFloat(negativeMarking),
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationHours: parseInt(durationHours, 10),
        showResults,
        isPublished, // 🔹 Include publish status
        questions: questions.map(q => ({
          text: q.text.trim(),
          options: q.options.map(opt => opt.trim()),
          correctAnswerIndex: parseInt(q.correctAnswerIndex, 10)
        }))
      };

      const res = await fetch(`https://exam-api-1kyg.onrender.com/api/exams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
      });

      if (res.ok) {
        alert('Exam updated successfully!');
        navigate('/admin/exams');
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Update failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading exam...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <>
      <style>{`
        .form-container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
        .form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; }
        .checkbox-group { margin: 0.5rem 0; display: flex; align-items: center; }
        .checkbox-group input { margin-right: 0.5rem; }
        .question-card { background: #f8fafc; padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 8px; position: relative; }
        .remove-btn { position: absolute; top: 10px; right: 10px; background: #e53e3e; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; }
        .option-group { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
        .option-input { flex: 1; }
        .correct-radio { margin-right: 0.5rem; }
        .btn-row { display: flex; gap: 1rem; margin-top: 2rem; }
        .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; }
        .btn-primary { background: #4a6cf7; color: white; }
        .btn-secondary { background: #e2e8f0; color: #2d3748; }
        .error { color: #e53e3e; margin: 1rem 0; }
      `}</style>

      <div className="form-container">
        <h2>Edit Exam</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Exam Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Time Limit (minutes)</label>
            <input type="number" min="1" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Marks Per Question</label>
            <input type="number" min="0.1" step="0.1" value={marksPerQuestion} onChange={(e) => setMarksPerQuestion(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Positive Marking</label>
            <input type="number" min="0" step="0.1" value={positiveMarking} onChange={(e) => setPositiveMarking(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Negative Marking</label>
            <input type="number" min="0" step="0.1" value={negativeMarking} onChange={(e) => setNegativeMarking(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Schedule Exam</label>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label>Exam Duration (Hours)</label>
            <input
              type="number"
              min="1"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              required
            />
            <small>Exam will be available for this duration after scheduled time (default: 24)</small>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="showResults"
              checked={showResults}
              onChange={(e) => setShowResults(e.target.checked)}
            />
            <label htmlFor="showResults">Show results to students after submission</label>
          </div>

          {/* 🔹 PUBLISH OPTION */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            <label htmlFor="isPublished">Publish exam (students will see it)</label>
          </div>

          <h3>Questions ({questions.length})</h3>
          {questions.map((q, qIndex) => (
            <div className="question-card" key={qIndex}>
              <button type="button" className="remove-btn" onClick={() => removeQuestion(qIndex)}>×</button>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Question"
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  required
                />
              </div>
              {q.options.map((opt, optIndex) => (
                <div className="option-group" key={optIndex}>
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswerIndex === optIndex}
                    onChange={() => setCorrectAnswer(qIndex, optIndex)}
                    className="correct-radio"
                  />
                  <input
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                    className="option-input"
                    value={opt}
                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={addQuestion}>
            + Add Question
          </button>

          <div className="btn-row">
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Update Exam'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/exams')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditExamForm;