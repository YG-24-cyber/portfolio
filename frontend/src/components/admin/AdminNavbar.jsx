import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  FolderGit2,
  FileText,
  FileDown,
  Settings,
  ExternalLink,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { adminUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const adminNavItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'CV Manager', path: '/admin/cv', icon: FileDown },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <nav className="max-w-7xl mx-auto rounded-2xl glass-panel bg-white/85 dark:bg-[#0c121e]/85 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          
          {/* Left Brand Badge */}
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 text-white font-black tracking-wider shadow-md shadow-cyan-500/25 group-hover:shadow-neon-cyan transition-all duration-300">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  TG CONSOLE
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-600 dark:text-cyan-400">
                System Command Center
              </span>
            </div>
          </Link>

          {/* Desktop Admin Tabs */}
          <div className="hidden lg:flex items-center gap-1.5">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-2.5">
            {/* Admin User Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5">
              <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
              <div className="text-left">
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-none">
                  Tamrat G/her
                </div>
                <div className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
                  {adminUser?.role || 'SUPER_ADMIN'}
                </div>
              </div>
            </div>

            {/* View Public Site in New Tab */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 hover:border-cyan-500/30 transition-all"
              title="Open public portfolio in a new tab"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-white/10 transition-all duration-200 shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-violet-600" />
              )}
            </button>

            {/* Logout Action Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all"
              title="End session and return to login"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>

            {/* Mobile Hamburger Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 transition-colors"
              aria-label="Toggle admin navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-5 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-1.5 animate-fadeIn">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/15 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1"
              >
                <span>View Public Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">
                ● 256-Bit Encrypted
              </span>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
