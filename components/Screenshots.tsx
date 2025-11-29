import React from 'react';
import { motion } from 'framer-motion';
import { ContentData } from '../types';

interface ScreenshotsProps {
  content: ContentData;
}

const Screenshots: React.FC<ScreenshotsProps> = ({ content }) => {
  return (
    <section className="py-24 bg-bg-lighter overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{content.screenshots.title}</h2>
          <p className="text-text-muted">{content.screenshots.subtitle}</p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative w-full overflow-x-auto no-scrollbar pb-8">
          <div className="flex space-x-8 px-4 w-max mx-auto">
             {content.screenshots.captions.map((caption, index) => (
               <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col items-center space-y-4"
               >
                  {/* Mockup Frame */}
                  <div className="relative w-[260px] h-[540px] bg-bg-dark border-8 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
                     {/* Screen Placeholder */}
                     <div className="flex-1 bg-gray-900 relative w-full h-full group">
                        <img 
                          src={`https://picsum.photos/260/540?random=${index + 10}`} 
                          alt={caption} 
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent opacity-80"></div>
                        
                        {/* Mock UI Elements */}
                        <div className="absolute bottom-8 left-4 right-4">
                           <div className="h-2 w-1/2 bg-white/20 rounded mb-2"></div>
                           <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                        </div>
                     </div>
                  </div>
                  <p className="text-sm font-medium text-text-secondary">{caption}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Screenshots;
