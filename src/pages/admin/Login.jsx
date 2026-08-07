import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    toast.success('Demo credentials filled');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-coffee-50 dark:bg-espresso relative overflow-hidden">
      <div className="max-w-md w-full glass-card rounded-3xl p-8 border border-coffee-200/50 dark:border-coffee-800/40 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-coffee-600 dark:bg-amber-500 text-white dark:text-espresso flex items-center justify-center font-black mx-auto mb-3 shadow-xl shadow-coffee-600/30">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Café Artisanal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Admin Management Portal Login
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-2xl text-sm font-medium border border-coffee-200 dark:border-coffee-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-2xl text-sm font-medium border border-coffee-200 dark:border-coffee-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-coffee-600 hover:bg-coffee-700 text-white font-extrabold rounded-2xl shadow-xl shadow-coffee-600/30 flex items-center justify-center gap-2 transition active:scale-98"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Action */}
        <div className="mt-6 pt-6 border-t border-coffee-100 dark:border-coffee-800/40 text-center">
          <button
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee-600 dark:text-amber-400 hover:underline"
          >
            <ShieldCheck className="w-4 h-4" />
            Use Demo Admin Credentials (admin / admin123)
          </button>
        </div>
      </div>
    </div>
  );
};
