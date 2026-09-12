import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useApp();
  const [email, setEmail] = useState('operations@biopolymerlabs.eu');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    navigate('/logistics');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-floating border border-gray-200/80 flex flex-col gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white">
            <RefreshCw className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black text-black tracking-tight">ReLoop</span>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Sign In to ReLoop</h1>
          <p className="text-xs text-gray-600 mt-1">
            Single unified authentication for sellers, buyers, recyclers, and carriers.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3.5 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Corporate Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 font-medium focus:ring-1 focus:ring-[#7201FF] outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-full font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#8FFE01]" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          New organisation?{' '}
          <Link to="/signup" className="text-[#7201FF] font-bold hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
