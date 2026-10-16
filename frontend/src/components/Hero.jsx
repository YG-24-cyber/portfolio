import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Send,
  Terminal,
  Copy,
  Check,
  Code2,
  Database,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { useSystemSettings } from '../utils/systemSettings';

export default function Hero() {
  const { settings } = useSystemSettings();
  const [copied, setCopied] = useState(false);

  const statusText = settings.isOpenToWork
    ? "Available for high-impact engineering"
    : "Focused on core systems engineering";

  const codeSnippet = `const developer = {
  name: "Tamrat G/her",
  discipline: "Applied Computing",
  leadership: "NexTech Innovators Leader",
  specialization: [
    "Hospital Management Systems",
    "Scalable Database Architecture",
    "Education Tech Platforms"
  ],
  stack: {
    frontend: ["React", "TypeScript", "Tailwind CSS"],
    backend: ["Node.js", "Express", "REST APIs"],
    database: ["PostgreSQL", "Data Modeling"]
  },
  status: "${statusText}"
};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="home" className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Dynamic Mesh / Aurora Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-500/15 via-sky-500/10 to-violet-600/15 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-20 right-10 w-[400px] h-[300px] bg-gradient-to-br from-violet-600/10 to-transparent rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Profile Headline, Story & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* NexTech Innovators Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold tracking-wide text-cyan-600 dark:text-cyan-400 mb-6 shadow-sm shadow-cyan-500/10">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>NexTech Innovators Leader & Computing Scholar</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
              Building scalable{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-600 dark:from-cyan-400 dark:via-sky-300 dark:to-violet-400 text-glow">
                data-driven systems
              </span>{' '}
              for real-world impact.
            </h1>

            {/* Personal Bio / Mission statement */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mb-8">
              Hi, I’m <span className="font-bold text-slate-900 dark:text-white">Tamrat G/her</span> — an{' '}
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Applied Computing student</span> and full-stack software developer.
              I specialize in architecting hospital management systems, resilient database infrastructures, and scalable digital solutions that empower communities in healthcare and education.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <Link
                to="/projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:via-sky-400 hover:to-violet-500 shadow-xl shadow-cyan-500/25 dark:shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-800 dark:text-slate-200 glass-card card-shine hover:bg-slate-100/80 dark:hover:bg-white/10 hover:border-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-sm"
              >
                <Send className="w-4 h-4 text-cyan-500" />
                <span>Get in Touch</span>
              </Link>
            </div>

            {/* Social Connectivity Island */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-white/10 w-full sm:w-auto">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mr-2">
                Connect:
              </span>
              <a
                href="https://github.com/YG-24-cyber"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 text-xs font-semibold"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4 text-cyan-500" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://linkedin.com/in/tamrat-g-her-034642380"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 text-xs font-semibold"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4 text-violet-500" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Right Column: Floating IDE Code Card (tamrat.config.ts) */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Background Glow behind the Card */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-violet-600/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition duration-500" />

            <div className="relative rounded-2xl glass-card card-shine overflow-hidden border border-white/60 dark:border-white/10 shadow-2xl backdrop-blur-2xl animate-float">
              {/* Window Header / Window Controls */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:opacity-100 cursor-pointer shadow-sm shadow-rose-500/40" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80 hover:opacity-100 cursor-pointer shadow-sm shadow-amber-400/40" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:opacity-100 cursor-pointer shadow-sm shadow-emerald-500/40" />
                  <span className="ml-2 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                    tamrat.config.ts
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>ONLINE</span>
                  </div>

                  {/* Copy snippet button */}
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono transition-colors ${
                      copied
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-slate-400 hover:text-cyan-500 hover:bg-slate-200/50 dark:hover:bg-white/10'
                    }`}
                    title="Copy code"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✓ Copied</span>
                      </>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Code Editor Body */}
              <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-800 dark:text-slate-200 overflow-x-auto bg-white/40 dark:bg-slate-950/60 selection:bg-cyan-500 selection:text-white">
                <div className="space-y-1">
                  <div>
                    <span className="text-violet-600 dark:text-violet-400 font-semibold">const</span>{' '}
                    <span className="text-cyan-600 dark:text-cyan-300 font-semibold">developer</span> = &#123;
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-600 dark:text-slate-400">name:</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">"Tamrat G/her"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-600 dark:text-slate-400">discipline:</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400">"Applied Computing"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-600 dark:text-slate-400">leadership:</span>{' '}
                    <span className="text-sky-600 dark:text-sky-300">"NexTech Innovators"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-600 dark:text-slate-400">specialization:</span> [
                    <div className="pl-4 text-amber-600 dark:text-amber-300">
                      "Hospital Management",<br />
                      "Scalable Databases",<br />
                      "Education Tech"
                    </div>
                    ],
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-600 dark:text-slate-400">stack:</span> &#123;
                    <div className="pl-4">
                      <span className="text-slate-500 dark:text-slate-400">frontend:</span> [
                      <span className="text-cyan-600 dark:text-cyan-300">"React"</span>,{' '}
                      <span className="text-cyan-600 dark:text-cyan-300">"Tailwind"</span>],
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-500 dark:text-slate-400">backend:</span> [
                      <span className="text-violet-600 dark:text-violet-300">"Node.js"</span>,{' '}
                      <span className="text-violet-600 dark:text-violet-300">"Express"</span>],
                    </div>
                    <div className="pl-4">
                      <span className="text-slate-500 dark:text-slate-400">database:</span> [
                      <span className="text-sky-600 dark:text-sky-300">"PostgreSQL"</span>]
                    </div>
                    &#125;,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-600 dark:text-slate-400">activeBuilding:</span>{' '}
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">true</span>
                  </div>
                  <div>&#125;;</div>
                </div>
              </div>

              {/* Bottom Quick-Info Bar */}
              <div className="px-4 py-2.5 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-cyan-500" />
                  <span>PostgreSQL & System Engines</span>
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Ready to deploy</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
