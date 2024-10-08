import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AlgorithmListPage } from './pages/Algorithm/AlgorithmListPage';
import { AlgorithmCreatePage } from './pages/Algorithm/AlgorithmCreatePage';
import { AlgorithmEditPage } from './pages/Algorithm/AlgorithmEditPage';

function App() {
  return (
    <Router>
      <div className="App" style={{ height: '100%', width: '100%' }}>
        <Header />
        <main style={{ height: 'calc(100% - 80px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/algoritmos" element={<AlgorithmListPage />} />
            <Route path="/algoritmos/novo" element={<AlgorithmCreatePage />} />
            <Route path="/algoritmos/:id" element={<AlgorithmEditPage />} />
            <Route path="/quizz" element={<div>Quizz</div>} />
            <Route path="/sobre" element={<div>Sobre</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
