import React, { useState, useEffect, useCallback } from 'react';
import { Terminal, X, Sparkles, Cpu, ShieldCheck } from 'lucide-react';

export default function WelcomeIntro() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('visited_session');
    } catch {
      return true;
    }
  });
  const [isExiting, setIsExiting] = useState(false);
  const [progressStarted, setProgressStarted] = useState(false);

  const handleDismiss = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    try {
      sessionStorage.setItem('visited_session', 'true');
    } catch {
      // safe fallback for private or restricted browsing modes
    }
    setTimeout(() => {
      setShowIntro(false);
    }, 700);
  }, [isExiting]);

  useEffect(() => {
    if (!showIntro) return;

    // Trigger smooth micro progress bar animation
    const progressTimer = setTimeout(() => {
      setProgressStarted(true);
    }, 50);

    // Auto-dismiss at 3400ms total (3200ms view + 600-700ms exit dissolve)
    const autoDismissTimer = setTimeout(() => {
      handleDismiss();
    }, 3400);

    // Escape key listener for immediate skip
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(autoDismissTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showIntro, handleDismiss]);

  if (!showIntro) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Introduction"
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-2xl cursor-pointer select-none transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* =========================================================================
          RADIAL AURORA GLOW (Cyan to Indigo Pulsing Orb)
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="w-[420px] sm:w-[680px] h-[420px] sm:h-[680px] bg-gradient-to-tr from-blue-600/25 via-indigo-500/20 to-purple-600/25 blur-3xl rounded-full animate-pulse" />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-cyan-500/15 rounded-full blur-2xl" />
      </div>

      {/* =========================================================================
          TOP RIGHT SKIP CONTROL
          ========================================================================= */}
      <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 hover:border-cyan-500/40 text-xs font-mono tracking-wide shadow-lg backdrop-blur-md transition-all duration-200"
          title="Press Esc or click to skip"
        >
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-300 font-sans font-semibold text-[10px]">Esc</kbd> or click anywhere to skip</span>
          <span className="p-0.5 rounded-full bg-white/5 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-300 transition-colors">
            <X className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* =========================================================================
          CENTRAL CINEMATIC DOSSIER CARD
          ========================================================================= */}
      <div
        onClick={(e) => {
          // Allow clicking card to also dismiss or interact cleanly
          e.stopPropagation();
          handleDismiss();
        }}
        className="relative z-10 max-w-2xl w-full p-8 sm:p-12 rounded-3xl bg-slate-900/70 border border-white/15 dark:border-white/10 shadow-2xl shadow-indigo-950/50 backdrop-blur-xl flex flex-col items-center text-center overflow-hidden hover:border-cyan-500/30 transition-colors"
      >
        {/* Subtle grid pattern background in card */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* 1. ENGINEERING TERMINAL BADGE */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 text-cyan-400 text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-6 shadow-inner shadow-cyan-950/50">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-sm shadow-cyan-400"></span>
          </span>
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>INITIALIZING SYSTEM ENVIRONMENT // FULL-STACK DOSSIER</span>
        </div>

        {/* 2. MAIN HEADLINE WITH RADIANT GRADIENT */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-5 bg-gradient-to-r from-blue-400 via-indigo-200 to-teal-300 bg-clip-text text-transparent">
          Welcome to Tamrat's Engineering Portfolio
        </h1>

        {/* 3. DYNAMIC ROLLING SUBTITLE */}
        <p className="text-sm sm:text-base md:text-lg font-medium text-slate-300 max-w-xl leading-relaxed mb-6">
          <span className="text-cyan-300 font-semibold">Full-Stack Architecture</span>
          <span className="mx-2 text-indigo-400">•</span>
          <span className="text-indigo-200 font-semibold">PostgreSQL Systems</span>
          <span className="mx-2 text-indigo-400">•</span>
          <span className="text-teal-300 font-semibold">Android Engineering</span>
        </p>

        {/* 4. SYSTEM TELEMETRY STRIP */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400 mb-6">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>NODE_ENV: <strong className="text-slate-200 font-semibold">PRODUCTION</strong></span>
          </div>
          <div className="hidden sm:block text-slate-600">|</div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CORE SERVICES: <strong className="text-emerald-300 font-semibold">ONLINE</strong></span>
          </div>
          <div className="hidden sm:block text-slate-600">|</div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>LATENCY: <strong className="text-cyan-300 font-semibold">&lt; 15ms</strong></span>
          </div>
        </div>

        {/* 5. MICRO PROGRESS LINE ALONG THE BOTTOM OF THE CARD */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800/80 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-sm shadow-cyan-500/50"
            style={{
              width: progressStarted ? '100%' : '0%',
              transition: 'width 3200ms linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}
