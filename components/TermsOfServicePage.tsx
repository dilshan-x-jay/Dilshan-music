
import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <h1 className="text-4xl font-black text-black mb-8">Terms of Service</h1>
      <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 space-y-10 shadow-sm">
        <section>
          <h2 className="text-xl font-bold text-black mb-4">1. User Agreements</h2>
          <p className="text-sp-gray leading-relaxed font-medium">
            By accessing Dilshan Music, you agree to use the platform for personal, non-commercial use only. Unauthorized distribution or reverse engineering of the site's codebase is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black mb-4">2. Intellectual Property</h2>
          <p className="text-sp-gray leading-relaxed font-medium">
            All music tracks, album art, and site assets are protected by copyright law. Downloads are provided for personal listening. Commercial redistribution of downloaded content requires explicit artist consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black mb-4">3. Admin Rights</h2>
          <p className="text-sp-gray leading-relaxed font-medium">
            Dilshan Chanushka and the Dilshan Music team reserve the right to remove any content or user account that violates platform integrity or local laws in Sri Lanka.
          </p>
        </section>

        <section className="pt-6 border-t border-gray-200">
          <p className="text-[10px] text-sp-light-gray uppercase tracking-widest text-center font-black">
            Acceptance of these terms is mandatory for platform usage.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
