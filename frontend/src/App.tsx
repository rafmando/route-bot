import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Simulator } from './pages/Simulator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Simulator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;