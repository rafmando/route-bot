import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Simulator } from './pages/Simulator';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ConfirmSignUp } from './pages/ConfirmSignUp';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/confirm" element={<ConfirmSignUp />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Simulator />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;