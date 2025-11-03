import { useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const ResultPage = () => {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <Layout>
        <div style={{ padding: '2rem' }}>Result not found. Please complete an exam first.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Exam Result</h2>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: result.score >= result.totalMarks * 0.7 ? '#38a169' : '#e53e3e' }}>
            {result.score} / {result.totalMarks}
          </div>
          <div style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
            Percentage: <strong>{result.percentage}%</strong>
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            <h3>Question-wise Result:</h3>
            {result.answers.map((ans, idx) => (
              <div key={idx} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                Q{idx + 1}: {ans.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                {ans.selectedOption != null && ` (Selected: ${String.fromCharCode(65 + ans.selectedOption)})`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultPage;