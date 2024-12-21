'use client'

import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';

import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

import ColoringApp from './projects/coloring/Color';
import FootballApp from './projects/football/Football'
import SubwaySurferApp from './projects/SubwaySurfer/Subway'
// import SonicApp from './projects/sonic/Sonic'
import IdleApp from './projects/idle/router'
import Card from './components/Card';

function App() {
  return (
    <Router>
      <div>
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isGamePage = location.pathname !== '/';
  const navigate = useNavigate();

  return (
    <div>
      {isHomePage && (
        <>
          <Header />
          <Hero />
        </>
      )}

      {isGamePage && (
        <button className="back-button absolute right-10 top-5" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/coloring-app" element={<ColoringApp />} />
        <Route path="/project/football-app" element={<FootballApp />} />
        <Route path="/project/SubwaySurfer-app" element={<SubwaySurferApp />} />
        {/* <Route path="/project/sonic-app" element={<SonicApp />} /> */}
        <Route path="/project/idle-app" element={<IdleApp />} />
      </Routes>

      {isHomePage && <Footer />}
    </div>
  );
}

function Home() {
  return (
    <div>
      <Card />
    </div>
  );
}

export default App;
