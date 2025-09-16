import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchQuiz, submitQuiz } from '../api/apiClient';
import type { Question, Quiz } from '../types';

export function useQuiz(quizId: string) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchQuiz(quizId).then((q) => {
      setQuiz(q);
      setIndex(0);
      setAnswers({});
      setLoading(false);
    });
  }, [quizId]);

  const current = useMemo<Question | null>(() => (quiz ? quiz.questions[index] : null), [quiz, index]);

  const select = useCallback((qid: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: optionIndex }));
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, (quiz?.questions.length || 1) - 1));
  }, [quiz]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  // inside useQuiz.ts
const submit = useCallback(async () => {
  if (!quiz) return null;
  const res = await submitQuiz(quiz.id, answers);
  return res; // attempt persisted on server, no sessionStorage
}, [quiz, answers]);


  return { quiz, current, index, total: quiz?.questions.length || 0, answers, select, next, prev, submit, loading };
}
