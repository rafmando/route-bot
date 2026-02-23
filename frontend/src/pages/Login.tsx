import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const { isSignedIn, nextStep } = await signIn({ username: email, password });
    console.log('isSignedIn:', isSignedIn, 'nextStep:', nextStep);
    if (isSignedIn) {
      navigate('/');
    }
  } catch (err: any) {
    console.log('Login error:', err);
    setError(err.message);
  }
};

  return (
    <div>
      <h1>Route Bot</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
        <p onClick={() => navigate('/signup')}>Don't have an account? Sign Up</p>
      </form>
    </div>
  );
}