import axios from 'axios';
import type { AttemptResult, Quiz, User } from '../types';

// Read the API base from Vite env (injected at build time)
// Make sure the Vercel env key is exactly VITE_API_URL
const apiBase = import.meta.env.VITE_API_URL as string | undefined;

// In production, fail fast if missing to avoid falling back to localhost
if (import.meta.env.PROD && !apiBase) {
  throw new Error('VITE_API_URL is missing in production build');
}

// Use the deployed URL in prod; localhost only for local dev
const baseURL = (apiBase || 'http://localhost:3001').replace(/\/+$/, ''); // trim trailing slash if any

// Optional one-time debug (comment out after verifying in prod)
// console.log('API baseURL:', baseURL);

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: false,
});

// Attach token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
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

// Quiz
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
