import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchAttempt } from '../api/apiClient';
import type { AttemptResult } from '../types';

export default function Result() {
  const { attemptId = '' } = useParams<{ attemptId: string }>();
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attemptId) {
      fetchAttempt(attemptId)
        .then(setResult)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [attemptId]);

  if (loading) return <div className="card">Loading results...</div>;
  if (!result) return <div className="card error">Result not found</div>;

  return (
  <div className="page-wrapper centered">
    <div className="card result-card">
      <div className="h2">🎉 Quiz Completed!</div>

      <div className="kpi">
        <div className="ring" style={{'--pct':`${result.score}%`} as any}><b>{result.score}%</b></div>
        <div>
          <div><b>Status:</b> <span className={`status ${result.pass?'':'fail'}`}>{result.pass?'PASS':'FAIL'}</span></div>
          <div><b>Score:</b> {result.correct} / {result.total}</div>
          <div><b>Date:</b> {new Date(result.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div className={`note ${result.pass?'':'fail'}`}>
        {result.pass ? '🎊 Congratulations! You passed.'
                     : '📚 Keep studying! You need 70% to pass.'}
      </div>

      <div className="quiz-actions">
        {result.pass && <Link className="btn warn" to={`/certificate/${attemptId}`}>🏆 Download Certificate</Link>}
        <Link className="btn ghost" to={`/quiz/${result.quizId}`}>🔄 Retake Quiz</Link>
        <Link className="btn ghost" to="/">🏠 Home</Link>
      </div>
    </div>
  </div>
);
}