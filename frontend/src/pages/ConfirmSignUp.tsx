import { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';
import { useNavigate, useLocation } from 'react-router-dom';

export function ConfirmSignUp() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      navigate('/login');
    } catch (err: any) {
      console.log('Confirm error:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Confirm Email</h1>
      <p>Check your email for a verification code</p>
      <form onSubmit={handleConfirm}>
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}