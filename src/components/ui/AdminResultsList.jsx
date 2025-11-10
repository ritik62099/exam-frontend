
import { useEffect, useState } from "react";
import api from "../../api/client";

const AdminResultsList = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // 🔹 Detect mobile / desktop view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Fetch results
  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        const data = await api("/exams/results", { method: "GET" });
        setResults(data.results || []);
      } catch (err) {
        console.error("Fetch results error:", err);
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
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://exam-api-1kyg.onrender.com/api/exams/results", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ examId, studentUsername }),
      });

      if (response.ok) {
        alert("Result deleted. Student can now re-attempt the exam.");
        const getResponse = await fetch("https://exam-api-1kyg.onrender.com/api/exams/results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await getResponse.json();
        setResults(data.results || []);
      } else {
        const err = await response.json();
        alert("Failed to delete result: " + (err.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

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
      console.error("Fetch exam details error:", err);
      alert("Failed to load exam details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedResult(null);
    setExamDetails(null);
  };

  // 🔹 Combined search by username or exam title
  const filteredResults = results.filter((r) => {
    const username = r.studentUsername?.toLowerCase() || "";
    const examTitle = r.examId?.title?.toLowerCase() || "";
    const term = search.toLowerCase();
    return username.includes(term) || examTitle.includes(term);
  });

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

        .results-page {
          min-height: 100vh;
          background: var(--bg-light);
          padding: 2rem;
          box-sizing: border-box;
        }

        .results-container {
          background: #fff;
          border-radius: 14px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        h2 {
          margin-bottom: 1.5rem;
          color: var(--text-dark);
          font-size: 1.75rem;
          font-weight: 700;
        }

        .search-box {
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
        }

        .search-box input {
          width: 400px;
          max-width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #ccc;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-box input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 6px rgba(74,108,247,0.3);
          outline: none;
        }

        /* 🖥 Desktop Table */
        .results-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 10px;
          overflow: hidden;
        }

        .results-table th, .results-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .results-table th {
          background: #edf2ff;
          color: #2d3748;
          font-weight: 600;
        }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 0.9rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: 0.25s;
        }

        .view-btn {
          background: var(--primary);
          color: white;
        }

        .view-btn:hover {
          background: #0a30ccff;
        }

        .reattempt-btn {
          background: var(--success);
          color: white;
        }

        .reattempt-btn:hover {
          background: #2f855a;
        }

        /* 📱 Mobile Cards */
        .results-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .result-card {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 3px 8px rgba(0,0,0,0.08);
        }

        .result-card h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          color: var(--text-dark);
        }

        .result-info {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 0.3rem;
        }

        .result-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .result-actions button {
          flex: 1;
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

       .option.correct { background: #c6f6d5; } /* Green for correct */
.option.wrong { background: #fed7d7; } /* Red for wrong */
.option.selected { background: #bee3f8; }
.option.correct.selected {
  background: #9ae6b4;
  border: 2px solid #2f855a;
}
.option.wrong.selected {
  background: #feb2b2;
  border: 2px solid #c53030;
}


        /* Responsive */
        @media (max-width: 768px) {
          .results-container {
            padding: 1.2rem;
          }
          .search-box input {
            width: 100%;
          }
          h2 {
            font-size: 1.4rem;
          }
        }
      `}</style>

      <div className="results-page">
        <div className="results-container">
          <h2>All Exam Results</h2>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by student or exam title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filteredResults.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <>
              {!isMobile ? (
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Exam</th>
                      <th>Score</th>
                      <th>Percentage</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.map((r) => (
                      <tr key={r._id}>
                        <td>{r.studentUsername}</td>
                        <td>{r.examId?.title || "N/A"}</td>
                        <td>{r.score} / {r.totalMarks}</td>
                        <td>{((r.score / r.totalMarks) * 100).toFixed(2)}%</td>
                        <td>{new Date(r.submittedAt).toLocaleString("en-GB")}</td>
                        <td className="actions-cell">
                          <button className="action-btn view-btn" onClick={() => handleViewDetails(r)}>
                            View
                          </button>
                          <button className="action-btn reattempt-btn" onClick={() =>
                            handleReattempt(r.examId?._id || r.examId, r.studentUsername)
                          }>
                            Reattempt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="results-cards">
                  {filteredResults.map((r) => (
                    <div className="result-card" key={r._id}>
                      <h3>{r.examId?.title || "N/A"}</h3>
                      <div className="result-info"><strong>Student:</strong> {r.studentUsername}</div>
                      <div className="result-info"><strong>Score:</strong> {r.score} / {r.totalMarks}</div>
                      <div className="result-info"><strong>Percentage:</strong> {((r.score / r.totalMarks) * 100).toFixed(2)}%</div>
                      <div className="result-info"><strong>Submitted:</strong> {new Date(r.submittedAt).toLocaleString("en-GB")}</div>
                      <div className="result-actions">
                        <button className="action-btn view-btn" onClick={() => handleViewDetails(r)}>View</button>
                        <button className="action-btn reattempt-btn" onClick={() =>
                          handleReattempt(r.examId?._id || r.examId, r.studentUsername)
                        }>Reattempt</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Modal */}
          {selectedResult && (
            <div className="modal">
              <div className="modal-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3>Exam Details</h3>
                  <button
                    onClick={closeModal}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>

                {loadingDetails ? (
                  <p>Loading exam details...</p>
                ) : examDetails ? (
                  <>
                    <h4>{examDetails.title}</h4>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(examDetails.scheduledAt).toLocaleDateString("en-GB")} |{" "}
                      <strong>Time:</strong>{" "}
                      {new Date(examDetails.scheduledAt).toLocaleTimeString("en-GB")}
                    </p>
                    <hr />

                    {examDetails.questions?.map((q, idx) => {
                      const ans = selectedResult.answers.find((a) => a.questionIndex === idx);
                      return (
                        <div key={idx} className="question-card">
                          <p><strong>Q{idx + 1}:</strong> {q.text}</p>
                          {q.options.map((opt, oIdx) => {
                            const isCorrect = oIdx === q.correctAnswerIndex;
                            const isSelected = ans?.selectedOption === oIdx;
                            const isWrong = isSelected && !isCorrect;
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
      </div>
    </>
  );
};

export default AdminResultsList;
