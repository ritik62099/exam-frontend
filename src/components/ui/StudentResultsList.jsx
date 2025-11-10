import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";

const StudentResultsList = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api(`/exams/results/${user.username}`, { method: "GET" });
        setResults(data.results || []);
      } catch (err) {
        console.error("Fetch results error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [user.username]);

  const handleViewDetails = async (result) => {
    setSelectedResult(result);
    setExamDetails(null);
    setLoadingDetails(true);

    try {
      const data = await api(`/exams/${result.examId._id || result.examId}`, {
        method: "GET",
      });
      setExamDetails(data.exam);
    } catch (err) {
      console.error("Exam fetch error:", err);
      alert("Failed to load exam details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedResult(null);
    setExamDetails(null);
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading results...</div>;

  return (
    <>
      <style>{`
        :root {
          --primary: #4a6cf7;
          --success: #38a169;
          --bg-light: #f0f4fa;
          --text-dark: #1a202c;
        }

        body {
          background: var(--bg-light);
        }

        .page {
          min-height: 100vh;
          padding: 2rem;
          background: var(--bg-light);
          display: flex;
          justify-content: center;
        }

        .results-container {
          width: 100%;
          max-width: 900px;
          background: white;
          border-radius: 14px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        h2 {
          margin-bottom: 1.5rem;
          color: var(--text-dark);
          font-size: 1.8rem;
          font-weight: 700;
          text-align: center;
        }

        .result-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.2rem 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .result-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-color: var(--primary);
        }

        .result-card h3 {
          margin: 0 0 0.6rem;
          color: var(--primary);
          font-size: 1.15rem;
        }

        .result-card p {
          margin: 0.3rem 0;
          color: #444;
          font-size: 0.95rem;
        }

        /* Modal */
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 800px;
          padding: 1.5rem;
          animation: slideUp 0.3s ease;
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
          overflow-y: auto;
          max-height: 90vh;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          margin-bottom: 1rem;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          color: var(--text-dark);
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.6rem;
          cursor: pointer;
          color: #666;
        }

        .question-card {
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 8px;
          background: #f9fafb;
          border-left: 4px solid var(--primary);
        }

        .option {
          margin: 0.3rem 0;
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
        }

        .option.correct { background: #c6f6d5; } /* green */
.option.wrong { background: #fed7d7; } /* light red */
.option.selected { background: #bee3f8; }
.option.correct.selected {
  background: #9ae6b4;
  border: 2px solid #2f855a;
}
.option.wrong.selected {
  background: #feb2b2;
  border: 2px solid #c53030;
}


        @media (max-width: 768px) {
          .results-container {
            padding: 1.2rem;
          }
          .result-card {
            padding: 1rem;
          }
          h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="page">
        <div className="results-container">
          <h2>My Exam Results</h2>

          {results.length === 0 ? (
            <p style={{ textAlign: "center" }}>No results found.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {results.map((result) => (
                <div
                  key={result._id}
                  className="result-card"
                  onClick={() => handleViewDetails(result)}
                >
                  <h3>{result.examId?.title || "Exam"}</h3>
                  <p>
                    Score:{" "}
                    <strong>
                      {result.score} / {result.totalMarks}
                    </strong>
                  </p>
                  <p>
                    Percentage:{" "}
                    <strong>
                      {((result.score / result.totalMarks) * 100).toFixed(2)}%
                    </strong>
                  </p>
                  <p>
                    Submitted:{" "}
                    {new Date(result.submittedAt).toLocaleString("en-GB")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔹 Modal */}
        {selectedResult && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Exam Review</h3>
                <button className="close-btn" onClick={closeModal}>
                  &times;
                </button>
              </div>

              {loadingDetails ? (
                <p>Loading exam details...</p>
              ) : examDetails ? (
                <>
                  <h4>{examDetails.title}</h4>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(examDetails.scheduledAt).toLocaleDateString("en-GB")}{" "}
                    | <strong>Time:</strong>{" "}
                    {new Date(examDetails.scheduledAt).toLocaleTimeString("en-GB")}
                  </p>
                  <hr />

                  {examDetails.questions?.map((q, idx) => {
                    const ans = selectedResult.answers.find(
                      (a) => a.questionIndex === idx
                    );
                    return (
                      <div key={idx} className="question-card">
                        <p>
                          <strong>Q{idx + 1}:</strong> {q.text}
                        </p>
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = oIdx === q.correctAnswerIndex;
                          const isSelected = ans?.selectedOption === oIdx;
                          const isWrong = isSelected && !isCorrect; // ✅ mark wrong answers

                          return (
                            <div
                              key={oIdx}
                              className={`option ${isCorrect ? "correct" : ""} ${isSelected ? "selected" : ""} ${isWrong ? "wrong" : ""}`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </div>
                          );
                        })}

                      </div>
                    );
                  })}
                </>
              ) : (
                <p>Exam details not available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentResultsList;
