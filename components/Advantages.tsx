import React from 'react';
import { motion } from 'framer-motion';
import { ContentData } from '../types';
import { Check, Star } from 'lucide-react';

interface AdvantagesProps {
  content: ContentData;
}

const Advantages: React.FC<AdvantagesProps> = ({ content }) => {
  return (
    <section id="advantages" className="py-24 bg-bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold">
            {content.advantages.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.advantages.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-primary-blue/30 transition-all group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Star className="w-24 h-24 text-white" />
              </div>
              
              <div className="w-12 h-12 rounded-full bg-primary-purple/20 flex items-center justify-center mb-6 text-primary-purple">
                <Check className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
