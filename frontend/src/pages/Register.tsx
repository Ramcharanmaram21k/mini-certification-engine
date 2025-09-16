import { useForm } from 'react-hook-form';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

type Form = { name: string; email: string; password: string };

export default function Register() {
  const { register: reg, handleSubmit } = useForm<Form>();
  const { register: doRegister } = useAuth();
  const nav = useNavigate();
  const onSubmit = async (data: Form) => {
    await doRegister(data.name, data.email, data.password);
    nav('/quiz/react-basics', { replace: true });
  };
  return (
  <div className="page-wrapper">
    <div className="card auth-card stack">
      <div className="h2">Create account</div>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <input className="input" placeholder="Name" {...reg('name',{required:true})}/>
        <input className="input" placeholder="Email" {...reg('email',{required:true})}/>
        <input className="input" type="password" placeholder="Password" {...reg('password',{required:true})}/>
        <button className="btn block">Create account</button>
      </form>
      <div className="auth-links">Have an account? <Link to="/login">Login</Link></div>
    </div>
  </div>
);

}
