import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminNavbar from './components/admin/AdminNavbar';
import ScrollProgress from './components/ScrollProgress';
import Home from './pages/Home';
import About from './pages/About';
import CV from './pages/CV';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminCV from './pages/admin/AdminCV';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './components/Icons';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent({ theme, toggleTheme }) {
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin/login';
  const isAdminConsole = location.pathname.startsWith('/admin') && !isAdminLogin;

  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 dark:bg-darkBg text-slate-800 dark:text-slate-100 relative selection:bg-cyan-500 selection:text-white overflow-x-hidden transition-colors duration-500">
        
        {/* =========================================================================
            AMBIENT GLOW ORBS & BACKGROUND LIGHTING (Glassmorphism Underlayer)
            ========================================================================= */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {/* Top-Left Cyan Ambient Orb */}
          <div className="absolute -top-32 -left-32 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-cyan-500/20 dark:bg-cyan-500/20 blur-[100px] sm:blur-[140px] animate-pulse-glow" />

          {/* Top-Right Violet Ambient Orb */}
          <div className="absolute top-20 -right-32 w-96 sm:w-[520px] h-96 sm:h-[520px] rounded-full bg-violet-600/20 dark:bg-violet-600/25 blur-[110px] sm:blur-[150px] animate-float-slow" />

          {/* Center-Mid Sky Glow Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-sky-500/10 dark:bg-sky-500/15 blur-[120px] sm:blur-[160px]" />

          {/* Bottom Ambient Glow Orb */}
          <div className="absolute -bottom-32 left-1/4 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-indigo-500/15 dark:bg-indigo-600/20 blur-[100px] sm:blur-[140px]" />

          {/* Subtle grid pattern overlay for high-tech aesthetic */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
        </div>

        {/* =========================================================================
            MAIN CONTENT AREA
            ========================================================================= */}
        {isAdminLogin ? (
          /* Isolated Admin Login Layout (No public navbar, no public footer) */
          <Routes>
            <Route path="/admin/login" element={<AdminLogin theme={theme} toggleTheme={toggleTheme} />} />
          </Routes>
        ) : (
          /* Public Portfolio & Guarded Command Center Layout */
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Conditional Navigation Bar: AdminNavbar for Admin Console, Public Navbar for Portfolio */}
            {isAdminConsole ? (
              <AdminNavbar theme={theme} toggleTheme={toggleTheme} />
            ) : (
              <Navbar theme={theme} toggleTheme={toggleTheme} />
            )}

            {/* Main Routing Area */}
            <main className="flex-grow">
              <Routes>
                {/* Public Portfolio Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cv" element={<CV />} />

                {/* Protected Admin Console Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <ProtectedRoute>
                      <AdminProjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blogs"
                  element={
                    <ProtectedRoute>
                      <AdminBlogs />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/cv"
                  element={
                    <ProtectedRoute>
                      <AdminCV />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Conditional Footer */}
            {isAdminConsole ? (
              <footer className="relative py-6 mt-12 border-t border-slate-200/60 dark:border-white/10 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">TG CONSOLE v2.1</span>
                    <span>•</span>
                    <span>Tamrat G/her Management Gateway</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>Status: <span className="text-emerald-500 font-bold">256-Bit Encrypted</span></span>
                    <span>•</span>
                    <Link to="/admin/dashboard" className="hover:text-cyan-400 transition-colors">Overview</Link>
                    <span>•</span>
                    <a href="/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Public Site ↗</a>
                  </div>
                </div>
              </footer>
            ) : (
              <footer className="relative py-10 mt-12 border-t border-slate-200/60 dark:border-white/10 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Left: Brand Identity & NexTech Leader info */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/20">
                      TG
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Tamrat G/her <span className="text-slate-400 font-normal">| Full-Stack Systems</span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Applied Computing & NexTech Innovators Leader
                      </p>
                    </div>
                  </div>

                  {/* Middle: Heart & Engineering note */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>Engineered with ultra-modern glassmorphism</span>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  </div>

                  {/* Right: Quick Links, Copyright & Admin Entry */}
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <a
                      href="https://github.com/YG-24-cyber"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                      aria-label="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    <a
                      href="https://linkedin.com/in/tamrat-g-her-034642380"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span>&copy; {new Date().getFullYear()} Tamrat G/her</span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <a
                      href="/admin/login"
                      className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors text-[11px] font-mono opacity-60 hover:opacity-100"
                      title="Security Command Center"
                    >
                      Console
                    </a>
                  </div>

                </div>
              </footer>
            )}
          </div>
        )}

      </div>
    </>
  );
}


export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'dark'; // Defaulting to dark neon aesthetic
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent theme={theme} toggleTheme={toggleTheme} />
      </BrowserRouter>
    </AuthProvider>
  );
}
