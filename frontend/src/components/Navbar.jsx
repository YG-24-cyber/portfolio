import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, FileDown, Sparkles } from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isCurrentPath = (path) => location.pathname === path;
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Home', path: '/', isRoute: true },
    { name: 'About', path: '/about', isRoute: true },
    { name: 'Skills', path: '/skills', isRoute: true },
    { name: 'Projects', path: '/projects', isRoute: true },
    { name: 'Blog', path: '/blog', isRoute: true },
    { name: 'CV', path: '/cv', isRoute: true },
    { name: 'Contact', path: '/contact', isRoute: true },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <nav
        className={`max-w-6xl mx-auto rounded-2xl glass-panel transition-all duration-300 ${
          scrolled
            ? 'shadow-2xl shadow-cyan-500/10 dark:shadow-black/60 bg-white/85 dark:bg-[#0f172a]/80'
            : 'bg-white/75 dark:bg-[#0f172a]/65'
        } border border-white/60 dark:border-white/10`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Logo Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 text-white font-black tracking-wider shadow-md shadow-cyan-500/20 group-hover:shadow-neon-cyan transition-all duration-300">
              <span className="text-sm font-extrabold tracking-tighter">TG</span>
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                Tamrat G/her
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">
                Full-Stack & Systems
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isCv = link.name === 'CV';

              if (isCv) return null; // Rendered as dedicated glowing CV button

              return link.isRoute ? (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? 'bg-white/10 text-blue-400 border border-white/10 shadow-sm backdrop-blur-md rounded-full px-3 py-1 font-semibold'
                        : 'px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100/50 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ) : (
                <a
                  key={link.name}
                  href={link.path}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-all duration-200"
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Right Action Island: CV Button + Theme Toggle + Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            {/* Glowing CV Button with Router Link */}
            <Link
              to="/cv"
              className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all duration-200 ${
                isCurrentPath('/cv')
                  ? 'bg-gradient-to-r from-violet-600 via-sky-500 to-cyan-500 shadow-neon-violet ring-2 ring-violet-400/50'
                  : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:via-sky-400 hover:to-violet-500 shadow-lg shadow-cyan-500/25 dark:shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>CV</span>
              {!isCurrentPath('/cv') && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              )}
            </Link>

            {/* Dark/Light Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Dark and Light Mode"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-white/10 transition-all duration-200 shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-violet-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-2 pb-5 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-1.5 animate-fadeIn">
            {navLinks.map((link) => {
              return link.isRoute ? (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white/10 text-blue-400 border border-white/10 shadow-sm backdrop-blur-md rounded-xl font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-white/5'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  {link.name === 'About' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                      Identity
                    </span>
                  )}
                  {link.name === 'Skills' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      Radar
                    </span>
                  )}
                  {link.name === 'Projects' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                      Gallery
                    </span>
                  )}
                  {link.name === 'Blog' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      Essays
                    </span>
                  )}
                  {link.name === 'CV' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-400">
                      Interactive
                    </span>
                  )}
                  {link.name === 'Contact' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400">
                      Connect
                    </span>
                  )}
                </NavLink>
              ) : (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-white/5 transition-colors"
                >
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
