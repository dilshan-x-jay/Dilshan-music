
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// Fixing imports for Firebase Auth password reset flow members
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { LogoIcon, ChevronLeftIcon } from './icons';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      setError("Invalid or expired link. Please request a new password reset.");
      return;
    }

    const verifyCode = async () => {
      try {
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
      } catch (err: any) {
        setError("This link has expired or has already been used.");
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (oobCode) {
        await confirmPasswordReset(auth, oobCode, newPassword);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err: any) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <LogoIcon className="w-16 h-16 text-sp-primary" />
          </div>
          <h1 className="text-3xl font-black text-black tracking-tight">Dilshan Music Security</h1>
          <p className="text-sp-gray font-bold text-sm">Create a new master password</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 relative overflow-hidden">
          {success ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-50 text-sp-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-black">Password Secured</h2>
              <p className="text-sp-gray font-medium">Redirecting you to the login gateway...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">{error}</p>
                </div>
              )}

              {email && (
                <div className="text-center mb-2">
                  <p className="text-xs font-bold text-sp-light-gray uppercase tracking-widest">Resetting for</p>
                  <p className="text-sm font-black text-black">{email}</p>
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-sp-primary/20 focus:bg-white transition-all outline-none font-bold"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-sp-primary/20 focus:bg-white transition-all outline-none font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-sp-primary transition-all uppercase text-[10px] tracking-[0.3em] shadow-xl disabled:opacity-50"
              >
                {isLoading ? 'Updating Vault...' : 'Save New Password'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full text-[10px] font-black text-sp-light-gray hover:text-black uppercase tracking-widest transition-colors flex items-center justify-center"
              >
                <ChevronLeftIcon className="w-4 h-4 mr-1" /> Return to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
