
import React from 'react';
import { LogoIcon } from '../icons';
import { 
  YoutubeIcon, 
  FacebookIcon, 
  WhatsappIcon, 
  InstagramIcon, 
  TiktokIcon 
} from '../icons/SocialIcons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <a href="/" className="flex items-center space-x-2">
            <LogoIcon className="w-8 h-8 text-sp-primary" />
            <span className="text-xl font-black text-black tracking-tighter uppercase">Dilshan Music</span>
          </a>
          <p className="text-sm text-sp-gray leading-relaxed max-w-xs font-medium">
            The ultimate destination for high-fidelity music discovery. Curated by Dilshan Chanushka for the true audiophile.
          </p>
          <div className="flex items-center space-x-4">
            <a href="https://youtube.com/@djzdilshanxjay?si=9XdKXTq12AApPFMP " target="_blank" rel="noreferrer" className="text-sp-gray hover:text-sp-primary transition-colors"><YoutubeIcon className="w-5 h-5" /></a>
            <a href="https://www.facebook.com/profile.php?id=100073626888418" target="_blank" rel="noreferrer" className="text-sp-gray hover:text-sp-primary transition-colors"><FacebookIcon className="w-5 h-5" /></a>
            <a href="https://www.instagram.com/dchanushka?igsh=MWd5bjFxcWh6MzZpMQ==" target="_blank" rel="noreferrer" className="text-sp-gray hover:text-sp-primary transition-colors"><InstagramIcon className="w-5 h-5" /></a>
            <a href="https://www.tiktok.com/@djzdilshan_x_jay?_r=1&_t=ZS-934QMNa3yp3" target="_blank" rel="noreferrer" className="text-sp-gray hover:text-sp-primary transition-colors"><TiktokIcon className="w-5 h-5" /></a>
            <a href="https://chat.whatsapp.com/EUOm3KleQy08Uo8ORdQx1p " target="_blank" rel="noreferrer" className="text-sp-gray hover:text-sp-primary transition-colors"><WhatsappIcon className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-xs font-black text-black uppercase tracking-[0.2em] mb-6">Explore</h4>
          <ul className="space-y-4 text-sm font-bold">
            <li><a href="/" className="text-sp-gray hover:text-black transition-colors">Home Feed</a></li>
            <li><a href="/artists" className="text-sp-gray hover:text-black transition-colors">Featured Artists</a></li>
            <li><a href="/liked" className="text-sp-gray hover:text-black transition-colors">Collections</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-black text-black uppercase tracking-[0.2em] mb-6">Platform</h4>
          <ul className="space-y-4 text-sm font-bold">
            <li><a href="/about" className="text-sp-gray hover:text-black transition-colors">About Dilshan Music</a></li>
            <li><a href="/privacy" className="text-sp-gray hover:text-black transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" className="text-sp-gray hover:text-black transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-black text-black uppercase tracking-[0.2em] mb-6">Contact</h4>
          <ul className="space-y-4 text-sm font-bold">
            <li className="text-sp-gray">Owner: <span className="text-black">Dilshan Chanushka</span></li>
            <li className="text-sp-gray">Phone: <a href="tel:+94743376317" className="text-sp-primary hover:underline">074 337 6317</a></li>
            <li className="text-sp-gray">Location: <span className="text-black font-semibold">Sri Lanka</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-sp-light-gray">
        <p>© {currentYear} Dilshan Music. All Rights Reserved.</p>
        <p>Developed by <span className="text-black">Dilshan Chanushka</span></p>
      </div>
    </footer>
  );
};

export default Footer;
