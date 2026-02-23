import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(() => {
        console.log('ProtectedRoute: user authenticated');
        setIsAuth(true);
      })
      .catch((err) => {
        console.log('ProtectedRoute: not authenticated', err);
        setIsAuth(false);
      });
  }, []);

  if (isAuth === null) return <p>Loading...</p>;
  if (!isAuth) return <Navigate to="/login" />;
  return <>{children}</>;
}