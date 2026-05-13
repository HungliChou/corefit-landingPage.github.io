import React from 'react';
import { ContentData, Language } from '../types';
import { Mail, Twitter, Facebook, Instagram } from 'lucide-react';
import CoreFitLogo from './CoreFitLogo';

interface FooterProps {
  content: ContentData;
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ content, lang }) => {
  const legalLinks = lang === 'en'
    ? [
        { href: '/en/terms/', label: 'Terms' },
        { href: '/en/privacy/', label: 'Privacy Policy' },
        { href: '/en/delete-account/', label: 'Delete Account' },
      ]
    : [
        { href: '/terms/', label: '服務條款' },
        { href: '/privacy/', label: '隱私權政策' },
        { href: '/delete-account/', label: '刪除帳號' },
      ];

  return (
    <footer className="bg-bg-dark pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-2 mb-4">
                <CoreFitLogo className="w-8 h-8" />
                <span className="text-2xl font-heading font-bold text-white">CoreFit</span>
             </div>
             <p className="text-text-muted max-w-sm">
               Professional training, smart management. The AI-driven fitness partner you've been waiting for.
             </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">{content.footer.contact}</h4>
            <ul className="space-y-2 text-text-muted text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4"/> support@corefit-ai.com</li>
              <li>business@corefit-ai.com</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">{content.footer.social}</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-text-muted hover:text-primary-blue transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-text-muted hover:text-primary-blue transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-text-muted hover:text-primary-blue transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 text-center text-text-muted text-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-4">
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-primary-blue transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <p>{content.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
