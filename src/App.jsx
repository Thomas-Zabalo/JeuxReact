'use client'

import './App.css';
import Card from './components/Card';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';


function App() {

  return (
    <div className="scroll-smooth focus:scroll-auto bg-white">

      <Header />

      <Hero />

      <main className='px-6 xl:px-32 '>
        <Card />
      </main>

      <Footer />

    </div >
  );
}

export default App;