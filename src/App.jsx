'use client'

import './App.css';
import Card from './components/Card';
import Header from './components/Header';
import Hero from './components/Hero';


function App() {

  return (
    <div className="bg-white">

      <Header />

      <Hero />

      <main className='m-6'>
        <Card/>
      </main>

    </div >
  );
}

export default App;
