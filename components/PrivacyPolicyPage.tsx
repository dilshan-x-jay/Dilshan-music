
import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <h1 className="text-4xl font-black text-black mb-8">Privacy Policy</h1>
      <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100 space-y-10 shadow-sm">
        <section>
          <h2 className="text-xl font-bold text-black mb-4">1. Data Collection</h2>
          <p className="text-sp-gray leading-relaxed font-medium">
            At Dilshan Music, we collect minimal information required to provide our services. This includes your display name, email address, and music preferences (likes) to personalize your experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black mb-4">2. Cookies & Tracking</h2>
          <p className="text-sp-gray leading-relaxed font-medium">
            We use essential cookies to maintain your login session and improve site performance. We do not sell your personal browsing data to third-party advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black mb-4">3. Data Security</h2>
          <p className="text-sp-gray leading-relaxed font-medium">
            All user profiles and music metadata are stored securely using industry-standard encryption through Firebase and Cloudflare technologies.
          </p>
        </section>

        <section className="pt-6 border-t border-gray-200">
          <p className="text-[10px] text-sp-light-gray uppercase tracking-widest font-black">
            Last Updated: {new Date().toLocaleDateString()} • Contact: Dilshan Chanushka
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
