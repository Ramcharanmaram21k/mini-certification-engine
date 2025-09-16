import React, { forwardRef } from 'react';
import dayjs from 'dayjs';

type Props = {
  name: string;
  quizTitle: string;
  score: number;
  attemptId: string;
};

const CertificateDocument = forwardRef<HTMLDivElement, Props>(({ name, quizTitle, score, attemptId }, ref) => {
  return (
    <div ref={ref} className="certificate">
      <h1>Certificate of Achievement</h1>
      <p>This certifies that</p>
      <h2 className="underline">{name}</h2>
      <p>has successfully completed the quiz</p>
      <h3>{quizTitle}</h3>
      <p>with a score of <strong>{score}%</strong>.</p>
      <div className="row">
        <div>
          <p>Date</p>
          <p className="underline">{dayjs().format('YYYY-MM-DD')}</p>
        </div>
        <div>
          <p>Attempt ID</p>
          <p className="underline small">{attemptId}</p>
        </div>
      </div>
      <div className="sign">AGH LMS Micro-Certification</div>
    </div>
  );
});

export default CertificateDocument;
