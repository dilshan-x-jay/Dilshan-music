
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <h1 className="text-4xl font-black text-black mb-8 uppercase tracking-tighter">About Dilshan Music</h1>
      <div className="space-y-8">
        <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-sp-primary mb-4 uppercase tracking-tight">Our Vision</h2>
          <p className="text-sp-gray leading-relaxed text-lg font-medium">
            Dilshan Music was born out of a deep-seated passion for high-fidelity audio and the desire to create a platform where music discovery feels like an elite experience. Founded by Dilshan Chanushka, we aim to bridge the gap between artists and listeners with a seamless, modern interface.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">The Man Behind the Music</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-48 h-48 bg-sp-primary/10 rounded-full flex items-center justify-center border border-sp-primary/20 flex-shrink-0 shadow-inner">
               <span className="text-5xl font-black text-sp-primary">DC</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tight">Dilshan Chanushka</h3>
              <p className="text-sp-gray font-medium">
                As a developer and music enthusiast, Dilshan envisioned a platform that doesn't just play tracks, but celebrates them. Dilshan Music is the culmination of technical precision and creative curation, designed to serve the Sri Lankan and global music community.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h4 className="font-black text-black mb-2 uppercase text-xs tracking-widest">High-Fidelity Only</h4>
              <p className="text-sm text-sp-gray font-medium">Every track uploaded is vetted for quality, ensuring you hear every detail exactly as the artist intended.</p>
           </div>
           <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h4 className="font-black text-black mb-2 uppercase text-xs tracking-widest">Global Access</h4>
              <p className="text-sm text-sp-gray font-medium">Connecting listeners from all over the world to a diverse library of genres and independent talent.</p>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
