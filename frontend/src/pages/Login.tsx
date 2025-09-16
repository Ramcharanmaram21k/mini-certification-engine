import { useForm } from 'react-hook-form';
import { useAuth } from '../auth/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

type Form = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit } = useForm<Form>();
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation() as any;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setError(null);
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      const redirectTo = location.state?.from?.pathname || '/quiz/react-basics';
      nav(redirectTo, { replace: true });
    } catch (e: any) {
      setError(e?.message || 'Wrong email or password');  // surface backend error
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="page-wrapper">
      <div className="card auth-card stack">
        <div className="h2">Login</div>
        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            {...register('email', { required: true })}
          />
          <div>
            <input
              className={`input ${error ? 'input-error' : ''}`}
              type="password"
              placeholder="Password"
              {...register('password', { required: true })}
            />
            {error && <div className="help">*Wrong email or password</div>}
          </div>
          <button className="btn block" disabled={loading}>
            {loading ? 'Checking…' : 'Login'}
          </button>
        </form>
        <div className="auth-links">New user? <Link to="/register">Register</Link></div>
      </div>
    </div>
  );
}
