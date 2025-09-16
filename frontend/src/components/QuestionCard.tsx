type Props = {
  question: {
    id: string;
    questionText: string;
    options: string[];
  };
  selected?: number;
  onSelect: (optionIndex: number) => void;
};

export default function QuestionCard({ question, selected, onSelect }: Props) {
  return (
    <div className="card">
      <h3>{question.questionText}</h3>
      <div className="options">
        {question.options.map((opt, i) => (
          <label key={i} className={`option ${selected === i ? 'selected' : ''}`}>
            <input
              type="radio"
              name={question.id}
              checked={selected === i}
              onChange={() => onSelect(i)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
