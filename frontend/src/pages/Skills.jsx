import React, { useState } from 'react';
import {
  Globe,
  Database,
  Smartphone,
  Monitor,
  Terminal,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Server,
  Code2,
  Workflow,
  GitBranch,
  Cloud,
  Lock,
  ArrowUpRight,
  Activity,
  Gauge,
  LayoutDashboard,
} from 'lucide-react';

export default function Skills() {
  const [activeDomain, setActiveDomain] = useState(null);

  const domains = [
    {
      id: 'web',
      icon: Globe,
      archetype: 'Web Apps',
      accent: 'from-cyan-500 to-sky-400',
      glowColor: 'group-hover:shadow-cyan-500/20',
      borderColor: 'group-hover:border-cyan-500/40',
      title: 'Full-Stack Web Architecture',
      subhead: 'Web Applications & Scalable APIs',
      telemetry: [
        { label: 'Production Grade', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Scalable APIs', color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
      ],
      metrics: [
        { name: 'Reactive UI / Vite', score: 96 },
        { name: 'REST & JWT Microservices', score: 92 },
        { name: 'P99 Response Benchmark', score: 95 },
      ],
      description:
        'Architecting resilient client-server ecosystems with reactive user interfaces, state synchronization, secure session lifecycles, and microservice-ready backend APIs.',
      sections: [
        {
          label: 'Frontend Stack',
          skills: ['React.js', 'Tailwind CSS', 'JavaScript (ES6+)', 'TypeScript', 'Glassmorphism UI', 'Responsive Design'],
        },
        {
          label: 'Backend & Services',
          skills: ['Node.js', 'Express.js', 'RESTful Architecture', 'JWT Authentication', 'CORS Hardening', 'API Gateways'],
        },
      ],
      guarantees: ['Modular Components', 'JWT Protected Routes', 'Sub-50ms API Latency'],
    },
    {
      id: 'erp',
      icon: LayoutDashboard,
      archetype: 'ERP Systems',
      accent: 'from-violet-500 to-fuchsia-400',
      glowColor: 'group-hover:shadow-violet-500/20',
      borderColor: 'group-hover:border-violet-500/40',
      title: 'Enterprise ERP & PostgreSQL Systems',
      subhead: 'Relational Modeling & ACID Engines',
      telemetry: [
        { label: 'Zero Leak Schema', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        { label: 'ACID Enforced', color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20' },
      ],
      metrics: [
        { name: 'ACID Referential Integrity', score: 98 },
        { name: 'High-Concurrency Transactions', score: 94 },
        { name: 'Role-Based Access Control', score: 96 },
      ],
      description:
        'Designing normalized database schemas for critical record management, hospital registries, executing ACID-compliant transactional flows, and fine-tuning B-tree query indexes.',
      sections: [
        {
          label: 'Database Engines',
          skills: ['PostgreSQL', 'Standard SQL', 'ACID Transactions', 'Connection Pooling (PgBouncer)'],
        },
        {
          label: 'Data Access & ORM',
          skills: ['Prisma ORM', 'Schema Migrations', 'Foreign Key Constraints', 'B-Tree Indexing'],
        },
      ],
      guarantees: ['Zero Data Loss', 'Referential Integrity', 'Optimized Join Operations'],
    },
    {
      id: 'mobile',
      icon: Smartphone,
      archetype: 'Mobile Apps',
      accent: 'from-cyan-500 to-emerald-400',
      glowColor: 'group-hover:shadow-cyan-500/20',
      borderColor: 'group-hover:border-cyan-500/40',
      title: 'Android Mobile Development',
      subhead: 'Native & Touch-First Solutions',
      telemetry: [
        { label: 'Touch-First UI', color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
        { label: 'Offline Sync', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' },
      ],
      metrics: [
        { name: 'Native Android Lifecycle', score: 92 },
        { name: 'Local SQLite Data Persistence', score: 95 },
        { name: 'Background WorkManager Sync', score: 90 },
      ],
      description:
        'Crafting intuitive mobile interfaces optimized for diverse device screens, handling state persistence across application lifecycles, and syncing local data caches with remote servers.',
      sections: [
        {
          label: 'Ecosystem & IDE',
          skills: ['Android Studio', 'Activity & Fragment Lifecycles', 'Dynamic Layouts', 'Material 3'],
        },
        {
          label: 'Storage & Network',
          skills: ['Local SQLite Storage', 'REST API Synchronization', 'Offline-First Caching', 'Background Services'],
        },
      ],
      guarantees: ['Lifecycle Resilience', 'Smooth Touch Gestures', 'Offline Reliability'],
    },
    {
      id: 'desktop',
      icon: Monitor,
      archetype: 'Desktop Apps',
      accent: 'from-violet-600 to-indigo-500',
      glowColor: 'group-hover:shadow-violet-600/20',
      borderColor: 'group-hover:border-violet-500/40',
      title: 'Desktop & Cross-Platform Systems',
      subhead: 'Native Desktop Workflows',
      telemetry: [
        { label: 'High Performance', color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20' },
        { label: 'Low Overhead', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      ],
      metrics: [
        { name: 'Low-Latency Local I/O', score: 94 },
        { name: 'Memory Footprint Efficiency', score: 93 },
        { name: 'IPC & Process Orchestration', score: 91 },
      ],
      description:
        'Engineering standalone desktop utilities and management consoles capable of high-throughput local disk operations, local state persistence, and low-latency workflows.',
      sections: [
        {
          label: 'Core Focus',
          skills: ['Cross-Platform Architecture', 'Low-Latency Execution', 'Local File I/O', 'CLI Tools'],
        },
        {
          label: 'State & Caching',
          skills: ['Local Configuration Caching', 'Offline Data Stores', 'Resource Efficiency', 'Error Recovery'],
        },
      ],
      guarantees: ['Instant Boot Speed', 'Minimal Memory Footprint', 'Robust Error Recovery'],
    },
  ];

  const devopsTooling = [
    { name: 'Git', category: 'VCS', icon: GitBranch },
    { name: 'GitHub CI/CD', category: 'Workflows', icon: Cloud },
    { name: 'Linux CLI / Bash', category: 'Environment', icon: Terminal },
    { name: 'Android Studio SDK', category: 'Mobile Tooling', icon: Smartphone },
    { name: 'Vercel', category: 'Edge Cloud', icon: Zap },
    { name: 'Render', category: 'Server Cloud', icon: Server },
    { name: 'Postman API Testing', category: 'API Quality', icon: Workflow },
    { name: 'Docker Basics', category: 'Containers', icon: Layers },
    { name: 'PostgreSQL CLI', category: 'Data Tooling', icon: Database },
  ];

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Dynamic Mesh / Aurora Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-cyan-500/10 via-sky-500/5 to-violet-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-20 right-10 w-[450px] h-[350px] bg-gradient-to-br from-violet-600/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* =========================================================================
            HEADER & ARCHITECTURE RADAR TAGLINE
            ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          {/* Frosted Capsule Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400 mb-4 shadow-sm shadow-cyan-500/10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Architecture & Systems Radar</span>
          </div>

          {/* Gradient Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
            Technical Skills &{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-600 dark:from-cyan-400 dark:via-sky-300 dark:to-violet-400 text-glow">
              Systems Radar
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
            Engineering reliable, cross-platform solutions across Web Apps, Mobile Apps, Desktop Apps, and Enterprise ERP Systems with rigorous software engineering discipline.
          </p>
        </div>

        {/* =========================================================================
            BENTO GRID (4 Core Engineering Domains in 2x2 Layout) - Interactive Radar Cards
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {domains.map((domain) => {
            const Icon = domain.icon;
            const isHovered = activeDomain === domain.id;

            return (
              <div
                key={domain.id}
                onMouseEnter={() => setActiveDomain(domain.id)}
                onMouseLeave={() => setActiveDomain(null)}
                className={`group relative rounded-2xl glass-card card-shine p-6 sm:p-7 flex flex-col justify-between border border-white/60 dark:border-white/10 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ${domain.borderColor} ${domain.glowColor}`}
              >
                {/* Ambient Card Background Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Top Header: Domain Icon + Status Badge */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${domain.accent} text-white shadow-md shadow-slate-900/10 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                            {domain.archetype}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                          {domain.title}
                        </h2>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {domain.subhead}
                        </span>
                      </div>
                    </div>

                    {/* Telemetry Pills */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                      {domain.telemetry.map((t) => (
                        <span
                          key={t.label}
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${t.color}`}
                        >
                          {t.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Domain Overview Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6">
                    {domain.description}
                  </p>

                  {/* Interactive Tech Radar Telemetry Gauges */}
                  <div className="mb-6 p-3.5 rounded-xl bg-slate-900/40 dark:bg-slate-900/70 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Activity className="w-3 h-3 animate-pulse" />
                        <span>RADAR TELEMETRY</span>
                      </span>
                      <span className="text-emerald-400">OPERATIONAL</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {domain.metrics.map((m) => (
                        <div key={m.name} className="space-y-0.5">
                          <div className="flex justify-between text-[10px] text-slate-300 font-medium">
                            <span>{m.name}</span>
                            <span className="font-mono text-cyan-400">{m.score}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-700 ease-out"
                              style={{ width: `${m.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Sub-sections with Capsule Chips */}
                  <div className="space-y-4 mb-6">
                    {domain.sections.map((section) => (
                      <div key={section.label} className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                          <span>{section.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {section.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs font-medium px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-white/5 group-hover:border-cyan-500/30 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Telemetry Footer */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    {domain.guarantees.map((g, idx) => (
                      <span key={idx} className="flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        <span>{g}</span>
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>

              </div>
            );
          })}
        </div>

        {/* =========================================================================
            FULL-WIDTH BOTTOM PANEL: DevOps, Tooling & Workflows
            ========================================================================= */}
        <div className="rounded-2xl glass-card card-shine p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-r from-cyan-500/10 to-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/20">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    DevOps, Environments & Platform Workflows
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Version control, cloud hosting, CI/CD pipelines, and local development environments.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 self-start sm:self-center">
                Validated Toolchain
              </span>
            </div>

            {/* Tooling Capsule Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {devopsTooling.map((tool) => {
                const ToolIcon = tool.icon;
                return (
                  <div
                    key={tool.name}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 border border-slate-200/60 dark:border-white/5 hover:border-cyan-500/30 transition-all duration-200 hover:-translate-y-0.5 group cursor-default"
                  >
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200/40 dark:border-white/5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                      <ToolIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                        {tool.name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                        {tool.category}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
