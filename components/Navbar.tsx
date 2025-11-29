import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentData, Language } from '../types';
import CoreFitLogo from './CoreFitLogo';

interface NavbarProps {
  content: ContentData;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Navbar: React.FC<NavbarProps> = ({ content, lang, setLang }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    setLang(lang === 'zh' ? 'en' : 'zh');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-bg-dark/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center gap-2">
              <CoreFitLogo className="w-10 h-10" />
              <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                CoreFit
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-text-secondary hover:text-primary-blue transition-colors font-medium">
                {content.nav.features}
              </button>
              
              <div className="h-6 w-px bg-white/20 mx-2"></div>

              <button 
                onClick={toggleLang} 
                className="flex items-center gap-1 text-text-muted hover:text-white transition-colors text-sm"
              >
                <Globe className="w-4 h-4" />
                {content.nav.langSwitch}
              </button>

              <button 
                onClick={() => scrollToSection('download')}
                className="bg-gradient-to-r from-primary-blue to-primary-purple hover:shadow-[0_0_20px_rgba(97,79,255,0.5)] text-white px-6 py-2 rounded-lg font-bold transition-all transform hover:-translate-y-0.5"
              >
                {content.nav.download}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-card border-t border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-3 py-3 text-text-secondary hover:bg-white/5 rounded-md">
                {content.nav.features}
              </button>
               <button onClick={toggleLang} className="block w-full text-left px-3 py-3 text-text-muted hover:bg-white/5 rounded-md flex items-center gap-2">
                 <Globe className="w-4 h-4" />
                {content.nav.langSwitch}
              </button>
              <button 
                 onClick={() => scrollToSection('download')}
                 className="block w-full text-center mt-4 bg-primary-blue text-white px-3 py-3 rounded-lg font-bold"
              >
                {content.nav.download}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;