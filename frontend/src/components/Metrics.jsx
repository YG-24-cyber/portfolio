import React from 'react';
import { Award, FolderGit2, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Metrics() {
  const metrics = [
    {
      id: 'gpa',
      value: '3.86',
      label: 'GPA / 4.0 Academic Score',
      category: 'Academic Excellence',
      description: 'Applied Computing focus with consistent top-tier academic performance and algorithmic rigor.',
      icon: Award,
      accent: 'from-cyan-500 to-sky-400',
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      glowClass: 'group-hover:shadow-cyan-500/20',
    },
    {
      id: 'projects',
      value: '10+',
      label: 'Completed Projects',
      category: 'Software Engineering',
      description: 'Full-stack applications, hospital management prototypes, education suites, and developer tools.',
      icon: FolderGit2,
      accent: 'from-violet-500 to-fuchsia-400',
      badgeColor: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20',
      glowClass: 'group-hover:shadow-violet-500/20',
    },
    {
      id: 'experience',
      value: '2+',
      label: 'Years Building Systems',
      category: 'Hands-on Track Record',
      description: 'Architecting relational databases, scalable APIs, and leading teams at NexTech Innovators.',
      icon: Cpu,
      accent: 'from-emerald-500 to-teal-400',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      glowClass: 'group-hover:shadow-emerald-500/20',
    },
  ];

  return (
    <section className="relative py-12 md:py-20 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading & Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200/60 dark:border-white/10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-cyan-600 dark:text-cyan-400 mb-2 block">
              Quantifiable Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineering Excellence & Proven Performance
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Consistently delivering high-fidelity architectures with academic rigor and hands-on execution.
          </p>
        </div>

        {/* 3-Card Antigravity Floating Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {metrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl glass-panel p-6 sm:p-8 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-white/60 dark:border-white/10 ${item.glowClass}`}
              >
                {/* Ambient Card Glow Hover Highlight */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="flex items-center justify-between mb-6">
                  {/* Neon Accent Icon Container */}
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-md shadow-slate-900/10 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Micro Category Tag */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${item.badgeColor}`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{item.category}</span>
                  </span>
                </div>

                {/* Metric Value */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                    {item.value}
                  </span>
                </div>

                {/* Metric Label */}
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
                  {item.label}
                </h3>

                {/* Supporting description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Subtle bottom arrow indicating depth */}
                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  <span>Verified metric</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
