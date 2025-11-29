import React from 'react';
import { motion } from 'framer-motion';
import { ContentData } from '../types';
import { Apple, Smartphone } from 'lucide-react';

interface DownloadProps {
  content: ContentData;
}

const Download: React.FC<DownloadProps> = ({ content }) => {
  return (
    <section id="download" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-primary-purple/20 -z-10"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-bg-card border border-white/10 rounded-[3rem] p-12 md:p-20 relative shadow-2xl"
        >
           {/* Glow Effect */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-blue/20 blur-[100px] rounded-full pointer-events-none"></div>

           <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 relative z-10">
             {content.download.title}
           </h2>
           <p className="text-xl text-text-muted mb-10 relative z-10">
             {content.download.subtitle}
           </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <button className="flex items-center gap-3 bg-white text-bg-dark px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-bold text-lg w-full sm:w-auto justify-center">
                 <Apple className="w-6 h-6 mb-1" />
                 {content.download.apple}
              </button>
              <button className="flex items-center gap-3 bg-transparent border-2 border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-colors font-bold text-lg w-full sm:w-auto justify-center">
                 <Smartphone className="w-6 h-6" />
                 {content.download.google}
              </button>
           </div>
           
           <div className="mt-10 text-sm text-text-muted relative z-10">
             Currently available on iOS 15+ and Android 10+
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Download;
