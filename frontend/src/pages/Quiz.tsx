import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import QuestionCard from '../components/QuestionCard';

export default function Quiz() {
  const { quizId = 'react-basics' } = useParams();
  const nav = useNavigate();
  const { quiz, current, index, total, answers, select, next, prev, submit, loading } = useQuiz(quizId);

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz || !current) return <p>Quiz not found.</p>;

  const selected = answers[current.id];

  const onSubmit = async () => {
    const res = await submit();
    if (!res) return;
    nav(`/result/${res.attemptId}`);
  };

  return (
    <div className="page-wrapper">
      <div className="card quiz-page">
        <div className="quiz-header">
          <h1>{quiz.title}</h1>
          <div className="quiz-progress">
            <span>Question {index + 1} of {total}</span>
            <div className="quiz-progress-bar">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${((index + 1) / total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="question-block">
          <h2>{current.questionText}</h2>
          <div className="options-container">
            {current.options.map((option, i) => (
              <div 
                key={i}
                className={`option-row ${selected === i ? 'selected' : ''}`}
                onClick={() => select(current.id, i)}
              >
                <input 
                  type="radio" 
                  name="answer" 
                  checked={selected === i}
                  onChange={() => select(current.id, i)}
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-nav">
          <button 
            className="btn ghost" 
            onClick={prev} 
            disabled={index === 0}
          >
            ← Previous
          </button>
          {index < total - 1 ? (
            <button className="btn" onClick={next}>
              Next →
            </button>
          ) : (
            <button className="btn submit-btn" onClick={onSubmit}>
              🎯 Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
