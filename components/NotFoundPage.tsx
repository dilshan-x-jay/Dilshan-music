
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoIcon, ChevronLeftIcon } from './icons';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 animate-fade-in text-center font-sans">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-sp-primary/5 rounded-full blur-3xl scale-150 animate-pulse"></div>
        <div className="relative bg-black p-6 rounded-full shadow-2xl">
          <LogoIcon className="w-10 h-10 text-white fill-white animate-[spin_10s_linear_infinite]" />
        </div>
      </div>

      <div className="space-y-6 max-w-lg mx-auto">
        <h1 className="text-[120px] font-thin text-black leading-none tracking-[-0.05em] opacity-10">404</h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-black uppercase tracking-[0.2em]">Lost Connection</h2>
          <p className="text-[11px] font-medium text-sp-gray/60 uppercase tracking-[0.3em] leading-relaxed">
            The track you are looking for has been moved or <br/> 
            removed from the Dilshan Music Archive.
          </p>
        </div>

        <div className="pt-10 flex flex-col items-center space-y-8">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center bg-black text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-sp-primary transition-all shadow-2xl active:scale-95"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
            Return to Dashboard
          </button>
          
          <div className="flex items-center space-x-4 opacity-30">
            <div className="h-[1px] w-8 bg-black"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.5em]">Dilshan Engineering</span>
            <div className="h-[1px] w-8 bg-black"></div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
