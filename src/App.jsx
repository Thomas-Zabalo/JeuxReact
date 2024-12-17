'use client'

import './App.css';
import Card from './components/Card';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ColoringApp from './projects/coloring/App';
import FootballApp from './projects/football/Game';

function App() {
  return (
    <Router>
      <div className="scroll-smooth focus:scroll-auto bg-white">


        <Header />
        <Hero />

        <main className='px-6 xl:px-32'>
          <Routes>

            <Route path="/" element={<Card />} />
            <Route path="/project/coloring-app" element={<ColoringApp />} />
            <Route path="/project/football-app" element={<FootballApp />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
