import axios from 'axios';
import type { AttemptResult, Quiz, User } from '../types';

export const api = axios.create({
  baseURL: (import.meta.env as any).VITE_API_BASE_URL || 'http://localhost:3001/api',

  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function loginApi(email: string, password: string): Promise<{ token: string; user: User }> {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function registerApi(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
  const { data } = await api.post('/auth/register', { name, email, password });
  return data;
}

export async function getProfileApi(_token: string): Promise<User> {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function fetchQuiz(quizId: string): Promise<Quiz> {
  const { data } = await api.get(`/quizzes/${encodeURIComponent(quizId)}`);
  return data;
}

export async function submitQuiz(quizId: string, answers: Record<string, number>): Promise<AttemptResult> {
  const { data } = await api.post(`/quizzes/${encodeURIComponent(quizId)}/submit`, { answers });
  return data;
}

export async function fetchAttempt(attemptId: string): Promise<AttemptResult> {
  const { data } = await api.get(`/results/${encodeURIComponent(attemptId)}`);
  return data;
}

export async function generateCertificate(attemptId: string): Promise<{ url: string }> {
  const { data } = await api.post('/certificate', { attemptId });
  return data;
}
