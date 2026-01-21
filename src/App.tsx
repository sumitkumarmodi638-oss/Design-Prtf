
import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { MicroInteractions } from './components/MicroInteractions';
import { Process } from './components/Process';
import { Contact } from './components/Contact';
import { AIChat } from './components/AIChat';

function App() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, [role="button"], input, .cursor-pointer');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <div className="bg-background text-text min-h-screen selection:bg-indigo-500/30 selection:text-white">
      {/* Custom Cursor */}
      <div 
        id="custom-cursor"
        className={`fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] rounded-full border border-white/30 mix-blend-difference transition-transform duration-150 ease-out flex items-center justify-center overflow-hidden hidden md:flex`}
        style={{ 
          transform: `translate3d(${cursorPos.x - 16}px, ${cursorPos.y - 16}px, 0) scale(${isHovering ? 2 : 1})`,
        }}
      >
        <div className={`w-1 h-1 bg-white rounded-full transition-opacity ${isHovering ? 'opacity-0' : 'opacity-100'}`}></div>
      </div>

      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Philosophy />
        <Projects />
        <MicroInteractions />
        <Process />
      </main>
      
      <Contact />
      
      {/* AI Assistant Widget */}
      <AIChat />
    </div>
  );
}

export default App;
