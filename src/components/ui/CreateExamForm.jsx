

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateExam } from '../../hooks/useCreateExam';

const CreateExamForm = () => {
  const navigate = useNavigate();
  const { createExam, loading, error, success } = useCreateExam();

  // Exam metadata
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [positiveMarking, setPositiveMarking] = useState(1);
  const [negativeMarking, setNegativeMarking] = useState(0);
  const [scheduledAt, setScheduledAt] = useState('');
  const [isPublished, setIsPublished] = useState(false); // 🔹 NEW

  // Questions
  const [questions, setQuestions] = useState([{
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0
  }]);

  const addQuestion = () => {
    setQuestions([...questions, {
      text: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    }]);
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

  const totalMarks = questions.length * marksPerQuestion;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!scheduledAt) {
      alert('Please select exam date and time');
      return;
    }

    const scheduleDate = new Date(scheduledAt);
    if (isNaN(scheduleDate.getTime())) {
      alert('Invalid date/time selected');
      return;
    }

    const processedQuestions = questions
      .map((q, idx) => {
        const text = q.text.trim();
        const options = q.options.map(opt => opt.trim());

        if (!text) throw new Error(`Question ${idx + 1} is empty`);
        if (options.some(opt => opt === '')) throw new Error(`All options in Question ${idx + 1} are required`);
        if (options.length !== 4) throw new Error(`Question ${idx + 1} must have 4 options`);

        return {
          text,
          options,
          correctAnswerIndex: parseInt(q.correctAnswerIndex, 10)
        };
      });

    const examData = {
      title: title.trim(),
      timeLimit: parseInt(timeLimit, 10),
      totalMarks,
      marksPerQuestion: parseFloat(marksPerQuestion),
      positiveMarking: parseFloat(positiveMarking),
      negativeMarking: parseFloat(negativeMarking),
      scheduledAt: scheduleDate.toISOString(),
      isPublished, // 🔹 Include publish status
      questions: processedQuestions
    };

    if (!examData.title) return alert('Exam title is required');
    if (isNaN(examData.timeLimit) || examData.timeLimit < 1) return alert('Valid time limit required');
    if (examData.questions.length === 0) return alert('Add at least one question');

    createExam(examData);
  };

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
        .alert { padding: 0.75rem; margin: 1rem 0; border-radius: 6px; }
        .alert-success { background: #c6f6d5; color: #2f855a; }
        .alert-error { background: #fed7d7; color: #c53030; }
      `}</style>

      <div className="form-container">
        <h2>Create New Exam</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">Exam created successfully!</div>}

        <form onSubmit={handleSubmit}>
          {/* Exam Metadata */}
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
            <label>Schedule Exam (Students can see from this time)</label>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required />
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

          <div className="form-group">
            <label>Total Marks: <strong>{totalMarks}</strong></label>
          </div>

          {/* Questions */}
          <h3>Questions ({questions.length})</h3>
          {questions.map((q, qIndex) => (
            <div className="question-card" key={qIndex}>
              <button type="button" className="remove-btn" onClick={() => removeQuestion(qIndex)}>×</button>
              <div className="form-group">
                <label>Question {qIndex + 1}</label>
                <input
                  type="text"
                  placeholder="Enter question"
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                  required
                />
              </div>
              <div>
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
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={addQuestion}>
            + Add Question
          </button>

          <div className="btn-row">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateExamForm;