import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sun,
  Moon,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin({ theme, toggleTheme }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password) {
      setErrorMsg('Please enter both your administrative identifier and master key.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username, password);
      setIsLoading(false);

      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrorMsg(result.message || 'Invalid administrative credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Network error connecting to authentication server.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-darkBg text-slate-800 dark:text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors duration-500">
      
      {/* =========================================================================
          AMBIENT SECURITY GLOW ORBS
          ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-cyan-500/20 dark:bg-cyan-500/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-32 -right-32 w-96 sm:w-[520px] h-96 sm:h-[520px] rounded-full bg-violet-600/20 dark:bg-violet-600/25 blur-[130px] animate-float-slow" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
      </div>

      {/* =========================================================================
          FLOATING TOP THEME SWITCHER
          ========================================================================= */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Dark and Light Mode"
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 glass-panel bg-white/70 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 shadow-lg transition-all duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-violet-600" />
          )}
        </button>
      </div>

      {/* =========================================================================
          CENTERED SECURITY LOCKBOX GLASS CARD
          ========================================================================= */}
      <div className="relative z-10 max-w-md w-full mx-auto">
        <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden bg-white/80 dark:bg-slate-900/75 backdrop-blur-2xl">
          
          {/* Card Top Glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            {/* Security Shield Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 text-white flex items-center justify-center shadow-xl shadow-cyan-500/25 border-2 border-white/40 dark:border-white/10 mb-4 animate-float">
              <Shield className="w-8 h-8" />
            </div>

            {/* Pill Label */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-mono font-bold tracking-wider uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Security Command Center</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Admin Portal Access
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tamrat G/her Portfolio System Management
            </p>
          </div>

          {/* Dynamic Error Alert */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Username / Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Admin Identifier
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or admin@tamrat.dev"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm glass-panel bg-white/60 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {/* Master Key Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Master Password
                </label>
                <span className="text-[10px] font-mono text-slate-400">Default: admin1234</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm glass-panel bg-white/60 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Session Checkbox */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500/30"
                />
                <span>Keep session active</span>
              </label>

              <span className="text-[10px] text-slate-400">Strict Auth</span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-xl shadow-cyan-500/25 dark:shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying security credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Note */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10 text-center text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>🔒 256-Bit Encrypted Admin Verification</span>
          </div>

        </div>

        {/* Navigation Escape Back to Portfolio */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
