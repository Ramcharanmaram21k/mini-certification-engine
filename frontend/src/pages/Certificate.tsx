import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAttempt } from '../api/apiClient';
import { useAuth } from '../auth/AuthContext';
import type { AttemptResult } from '../types';

export default function Certificate() {
  const { attemptId = '' } = useParams<{ attemptId: string }>();
  const { user } = useAuth();
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (attemptId) {
      fetchAttempt(attemptId)
        .then(setResult)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [attemptId]);

  const handleDownload = () => {
    // Placeholder for PDF generation - will be implemented in Phase 3
    alert('🚧 PDF download will be implemented in the next phase!\n\nFor now, you can use Print (Ctrl+P) to save as PDF.');
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Certificate',
        text: `I just completed ${result?.quizTitle} with ${result?.score}% score!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate link copied to clipboard!');
    }
  };

  if (loading) return <div className="card">Loading certificate...</div>;
  if (!result || !user) return <div className="card error">Certificate not found</div>;
  if (!result.pass) return (
    <div className="card error">
      <h2>Certificate Not Available</h2>
      <p>You need to pass the quiz (70% or higher) to receive a certificate.</p>
      <p>Your score: {result.score}%</p>
    </div>
  );

  return (
  <div className="page-wrapper cert-page">
    <div className="cert-wrap">
      <div className="cert" ref={certificateRef}>
        <h1>Certificate of Achievement</h1>
        <div className="logo">🎓</div>
        <div className="muted">This certifies that</div>
        <div className="name">{user.name}</div>
        <div className="muted">has successfully completed</div>
        <div className="course">{result.quizTitle}</div>

        <div className="cert-grid">
          <div className="cert-item"><div className="label">Score</div><div className="value">{result.score}%</div></div>
          <div className="cert-item"><div className="label">Status</div><div className="value">PASSED</div></div>
          <div className="cert-item"><div className="label">Date</div><div className="value">{new Date(result.createdAt).toLocaleDateString()}</div></div>
        </div>

        <div className="cert-foot">
          Certificate ID: {attemptId}<br/>LMS Micro‑Certification Portal
        </div>
      </div>

      <div className="stack mt-16 center">
        <button className="btn warn" onClick={handleDownload}>📄 Download PDF</button>
        <button className="btn ghost" onClick={() => window.history.back()}>← Back to Results</button>
      </div>
    </div>
  </div>
);

}
