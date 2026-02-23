import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email }
        }
      });
      navigate('/confirm', { state: { email } });
    } catch (err: any) {
      console.log('SignUp error:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
      <p onClick={() => navigate('/login')}>Already have an account? Login</p>
    </div>
  );
}