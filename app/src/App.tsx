import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/algoritmos" element="
            <div>Algoritmos</div> 
          "/>
          <Route path="/quizz" element="
            <div>Quizz</div>
          "/>
          <Route path="/sobre" element="
            <div>Sobre</div>
          "/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
