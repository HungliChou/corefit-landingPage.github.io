import React from 'react';
import { motion } from 'framer-motion';
import { ContentData } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface IntroProps {
  content: ContentData;
}

const Intro: React.FC<IntroProps> = ({ content }) => {
  return (
    <section id="intro" className="py-24 bg-bg-dark relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
            {content.intro.title}
          </h2>
          <p className="text-xl text-text-muted leading-relaxed mb-12">
            {content.intro.description}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {content.intro.badges.map((badge, index) => (
               <div key={index} className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary-blue/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center text-primary-blue">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm md:text-base">{badge}</span>
               </div>
             ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Intro;
