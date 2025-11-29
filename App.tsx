import React, { useState } from 'react';
import { CONTENT } from './constants';
import { Language } from './types';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Features from './components/Features';
import Download from './components/Download';
import Footer from './components/Footer';

const App: React.FC = () => {
  // State for language preference (defaulting to Traditional Chinese as requested primarily)
  const [lang, setLang] = useState<Language>('zh');
  
  // Derived content based on language state
  const currentContent = CONTENT[lang];

  return (
    <div className="min-h-screen bg-bg-dark text-text-main font-sans selection:bg-primary-blue/30 selection:text-white">
      
      <Navbar content={currentContent} lang={lang} setLang={setLang} />
      
      <main>
        <Hero content={currentContent} />
        <Intro content={currentContent} />
        <Features content={currentContent} />
        <Download content={currentContent} />
      </main>

      <Footer content={currentContent} />
      
    </div>
  );
};

export default App;