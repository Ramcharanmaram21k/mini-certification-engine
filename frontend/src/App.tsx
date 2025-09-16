import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Certificate from './pages/Certificate';
import RequireAuth from './routes/RequireAuth';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz/react-basics" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<RequireAuth />}>
        <Route path="/quiz/:quizId" element={<Quiz />} />
        <Route path="/result/:attemptId" element={<Result />} />
        <Route path="/certificate/:attemptId" element={<Certificate />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
