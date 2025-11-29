import React from 'react';
import { motion } from 'framer-motion';
import { ContentData, FeatureItem } from '../types';
import * as Icons from 'lucide-react';

interface FeaturesProps {
  content: ContentData;
}

const IconRenderer = ({ name }: { name: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LucideIcon = (Icons as any)[name];
  return LucideIcon ? <LucideIcon className="w-6 h-6" /> : <Icons.Activity className="w-6 h-6" />;
};

const FeatureItemCard: React.FC<{ item: FeatureItem }> = ({ item }) => (
  <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary-blue/30 transition-all hover:bg-white/10 group">
    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-primary-blue shadow-inner border border-white/5 group-hover:scale-105 transition-transform">
      <IconRenderer name={item.iconName} />
    </div>
    <div>
      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary-blue-light transition-colors">{item.title}</h4>
      <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
    </div>
  </div>
);

// Component to display stacked phone mockups
const StackedScreenshots: React.FC<{ title: string; index: number }> = ({ title, index }) => (
  <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/20 to-primary-purple/20 blur-[80px] opacity-50"></div>
      
      {/* Second Phone (Behind/Offset) */}
      <motion.div 
        className="absolute w-[260px] h-[520px] bg-gray-800 border-8 border-gray-700 rounded-[2.5rem] shadow-xl overflow-hidden transform translate-x-12 -translate-y-6 opacity-60 z-0"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 0.6, x: 48 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
         <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
            <div className="text-center p-4">
               <Icons.Image className="w-8 h-8 text-white/10 mx-auto mb-2" />
               <p className="text-white/10 text-xs uppercase tracking-widest">Screen 2</p>
            </div>
            {/* Simulated UI lines */}
            <div className="absolute inset-x-4 top-12 space-y-2 opacity-10">
              <div className="h-24 bg-white w-full rounded-lg"></div>
              <div className="h-12 bg-white w-full rounded-lg"></div>
            </div>
         </div>
      </motion.div>

      {/* Main Phone (Front) */}
      <motion.div 
        className="relative w-[280px] h-[560px] bg-bg-dark border-[12px] border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col z-10 group hover:scale-[1.02] transition-transform duration-500"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[25px] bg-gray-800 rounded-b-xl z-20"></div>
          
          {/* Screen Content Placeholder */}
          <div className="flex-1 bg-gray-900 relative w-full h-full flex flex-col items-center justify-center p-6 text-center border border-white/5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icons.Image className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-primary-blue-light font-medium uppercase tracking-widest text-sm mb-1">
                  {title}
              </p>
              <p className="text-white/40 text-xs">
                  Main Screenshot
              </p>
              <div className="mt-6 border border-white/10 rounded px-3 py-1 text-[10px] text-text-muted">
                  Place app screenshot here
              </div>
              
              {/* Placeholder UI Elements */}
              <div className="absolute bottom-10 left-6 right-6 space-y-3 opacity-10">
                  <div className="h-2 bg-white rounded w-3/4"></div>
                  <div className="h-2 bg-white rounded w-1/2"></div>
                  <div className="h-2 bg-white rounded w-full"></div>
              </div>
              
              {/* 
                 To use real images:
                 <img src={`/path/to/${title}-screen.png`} className="absolute inset-0 w-full h-full object-cover" />
              */}
          </div>
      </motion.div>

      {/* Floating Caption */}
      <div className="absolute -bottom-4 right-10 z-20 bg-bg-card/90 backdrop-blur border border-white/10 px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-text-muted flex items-center gap-2">
          <Icons.Layers className="w-3 h-3" />
          Multiple Views
        </div>
      </div>
  </div>
);

const Features: React.FC<FeaturesProps> = ({ content }) => {
  const categories = [
    content.features.categories.ai,
    content.features.categories.resources,
    content.features.categories.management,
    content.features.categories.tracking,
    content.features.categories.social,
    content.features.categories.coach
  ];

  return (
    <section id="features" className="py-24 bg-bg-lighter relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-purple/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            {content.features.title}
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            {content.features.subtitle}
          </p>
        </div>

        <div className="space-y-32">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              
              {/* Text Side */}
              <motion.div 
                className="flex-1 space-y-8 w-full"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                      <span className="w-1.5 h-8 bg-gradient-to-b from-primary-blue to-primary-purple rounded-full block"></span>
                      {cat.title}
                    </h3>
                </div>

                <div className="grid gap-4">
                  {cat.items.map((item, i) => (
                    <FeatureItemCard key={i} item={item} />
                  ))}
                </div>
              </motion.div>

              {/* Image Side (Stacked Phones) */}
              <div className="flex-1 w-full">
                 <StackedScreenshots title={cat.title} index={index} />
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;