'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Building2, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const INDUSTRIES = [
  'Iron & Steel',
  'Automotive',
  'FMCG',
  'Agriculture',
  'Pharmaceuticals',
  'Construction',
  'Food & Beverage',
  'Chemicals',
  'Textiles',
  'Electronics'
];

export default function AuthModal() {
  const { showAuthModal, pendingAction, login, signup, closeAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'signin') {
        await login(email, password);
      } else {
        await signup(companyName, industry, email, password, city, state);
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={closeAuthModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative mx-4 w-full max-w-md rounded-3xl bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={closeAuthModal}
            className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {pendingAction && (
            <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 text-sm">
              Please sign in to {pendingAction.description.toLowerCase()}.
            </div>
          )}

          <div className="mb-8 flex space-x-4 border-b border-white/10">
            <button
              onClick={() => setActiveTab('signin')}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === 'signin' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
              {activeTab === 'signin' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === 'signup' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
              {activeTab === 'signup' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-emerald-500"
                />
              )}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <>
                <div className="space-y-4">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      required
                      className="w-full rounded-xl border border-white/10 bg-slate-800 py-3 pl-10 pr-4 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-4">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {activeTab === 'signin' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <button type="button" className="text-sm text-emerald-400 hover:text-emerald-300">
                  Forgot password?
                </button>
              </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white transition-all hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="mr-2 h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
