import React from 'react';
import { motion } from 'framer-motion';
import { ContentData } from '../types';
import { ArrowRight, Activity, Zap, ShieldCheck } from 'lucide-react';

interface HeroProps {
  content: ContentData;
}

const Hero: React.FC<HeroProps> = ({ content }) => {
  const scrollToFeatures = () => {
    document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradient Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-purple/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-blue/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-sm text-text-secondary font-medium tracking-wide">{content.hero.slogan}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold leading-tight mb-6">
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
               {content.hero.headline.split(' ')[0]} 
             </span>
             <br />
             <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary-blue to-primary-purple">
               {content.hero.headline.split(' ').slice(1).join(' ')}
             </span>
          </h1>
          
          <p className="text-lg md:text-xl text-text-muted mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            {content.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
            <button 
               onClick={() => document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })}
               className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-primary-blue to-primary-purple hover:shadow-[0_0_30px_rgba(26,117,255,0.4)] rounded-xl font-bold text-white text-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {content.hero.ctaPrimary}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:border-primary-blue hover:bg-primary-blue/10 rounded-xl font-bold text-white text-lg transition-all"
            >
              {content.hero.ctaSecondary}
            </button>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center justify-center lg:justify-start gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://picsum.photos/50/50?random=${i}`} className="w-10 h-10 rounded-full border-2 border-bg-dark" alt="User" />
              ))}
            </div>
            <div className="text-sm text-text-muted">
               <span className="text-yellow-400">★★★★★</span>
               <span className="ml-2">{content.hero.stats}</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Image / Graphics */}
        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative hidden lg:block"
        >
          <div className="relative mx-auto w-[320px] h-[650px] bg-bg-dark rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
             {/* Screen Content Mockup */}
             <div className="relative h-full w-full bg-gradient-to-b from-gray-900 to-bg-dark p-4 flex flex-col">
                {/* App Header */}
                <div className="flex justify-between items-center mb-6 mt-6">
                   <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                   <div className="text-white font-bold">CoreFit</div>
                   <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                </div>
                
                {/* Activity Rings Mockup */}
                <div className="flex justify-center my-8 relative">
                   <div className="w-48 h-48 rounded-full border-[12px] border-gray-800 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border-[12px] border-primary-blue border-l-transparent border-b-transparent rotate-45"></div>
                      <div className="absolute inset-4 rounded-full border-[12px] border-primary-purple border-r-transparent border-b-transparent -rotate-12"></div>
                      <div className="text-center">
                         <div className="text-3xl font-bold text-white">85%</div>
                         <div className="text-xs text-gray-400">Today's Goal</div>
                      </div>
                   </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-white/5 p-3 rounded-xl backdrop-blur-sm">
                      <Activity className="w-5 h-5 text-primary-blue mb-2" />
                      <div className="text-lg font-bold text-white">1,250</div>
                      <div className="text-xs text-gray-400">Calories</div>
                   </div>
                   <div className="bg-white/5 p-3 rounded-xl backdrop-blur-sm">
                      <Zap className="w-5 h-5 text-primary-purple mb-2" />
                      <div className="text-lg font-bold text-white">1.5h</div>
                      <div className="text-xs text-gray-400">Duration</div>
                   </div>
                </div>
                
                 {/* List Mockup */}
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-14 bg-white/5 rounded-xl flex items-center px-3 gap-3">
                         <div className="w-8 h-8 rounded-md bg-gray-700"></div>
                         <div className="flex-1">
                           <div className="h-3 w-24 bg-gray-700 rounded mb-1"></div>
                           <div className="h-2 w-16 bg-gray-800 rounded"></div>
                         </div>
                      </div>
                    ))}
                </div>
             </div>
             
             {/* Reflection */}
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute top-1/4 -right-4 bg-bg-card p-4 rounded-xl border border-white/10 shadow-xl"
          >
             <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-400 w-8 h-8" />
                <div>
                  <div className="text-sm text-gray-400">Achievement Unlocked</div>
                  <div className="text-white font-bold">Iron Lifter</div>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
