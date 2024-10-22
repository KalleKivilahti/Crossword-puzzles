import { useState } from 'react';
import Generator from './components/Generator';
import Hero from './components/Hero';

function App() {
  return (
    <main className='font-teko min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-950 to-slate-950 text-white text-sm sm:text-base p-4'>
      <Hero />
      <Generator />
    </main>
  );
}

export default App;
