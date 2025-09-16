export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  passScore: number;
  questions: Question[];
}

export interface AttemptResult {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  total: number;
  correct: number;
  score: number;
  pass: boolean;
  createdAt: string;
}
