import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  GraduationCap,
  Award,
  Users,
  Rocket,
  Code2,
  Database,
  Smartphone,
  Monitor,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Send,
  FileText,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function About() {
  const leadershipPillars = [
    { title: 'Technical Workshops', desc: 'Conducted weekly sessions on full-stack web and database architecture for 40+ students.' },
    { title: 'Architectural Reviews', desc: 'Guided peer projects through strict relational schema modeling, indexing, and API security.' },
    { title: 'Community Mentorship', desc: 'Fostered hands-on engineering workflows and collaborative version control discipline with Git.' },
    { title: 'Applied Solutions', desc: 'Directed prototypes addressing local administrative and healthcare operational challenges.' },
  ];

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Dynamic Mesh / Aurora Background Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-sky-500/5 to-violet-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-20 right-10 w-[450px] h-[350px] bg-gradient-to-br from-violet-600/10 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* =========================================================================
            HEADER SECTION
            ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          {/* Frosted Capsule Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400 mb-4 shadow-sm shadow-cyan-500/10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Identity & Leadership</span>
          </div>

          {/* Gradient Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
            About{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-600 dark:from-cyan-400 dark:via-sky-300 dark:to-violet-400 text-glow">
              Tamrat G/her
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
            Applied Computing Student, Full-Stack Software Developer & NexTech Innovators Technical Lead dedicated to building high-impact data-driven systems.
          </p>
        </div>

        {/* =========================================================================
            BENTO SECTION 1: Journey (7 cols) + Academic Foundation (5 cols)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-8">
          
          {/* Left Card (7 cols): The Engineering Journey */}
          <div className="lg:col-span-7 rounded-2xl glass-card card-shine p-6 sm:p-8 flex flex-col justify-between border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-3">
                <Rocket className="w-4 h-4 text-cyan-500" />
                <span>The Engineering Journey</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                Bridging Theoretical Rigor with Mission-Critical Systems
              </h2>

              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <p>
                  As an <span className="font-bold text-slate-900 dark:text-white">Applied Computing student at Mekelle University</span>, my focus has always been on translating algorithmic principles into resilient, real-world platforms. I believe great software is defined by clean architecture, database integrity, and high operational reliability.
                </p>
                <p>
                  Over the past two years, I have architected comprehensive systems for healthcare and educational administration — tackling complex challenges including patient electronic health record privacy, concurrent doctor scheduling, and high-performance relational schemas with PostgreSQL and Prisma.
                </p>
                <p>
                  Whether engineering full-stack web applications, native Android tools, or desktop utilities, I prioritize ACID transaction guarantees, modular codebases, and seamless user experiences.
                </p>
              </div>
            </div>

            {/* Core Values Capsule Row */}
            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap gap-2">
              {['Data Integrity First', 'Modular Architecture', 'High Concurrency', 'User-Centric Glassmorphism'].map((value) => (
                <span
                  key={value}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-white/5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{value}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Card (5 cols): Academic Foundation & Mekelle University */}
          <div className="lg:col-span-5 rounded-2xl glass-card card-shine p-6 sm:p-8 flex flex-col justify-between border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  <GraduationCap className="w-4 h-4 text-violet-500" />
                  <span>Academic Foundation</span>
                </div>

                {/* Score Pill */}
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                  3.86 / 4.0 GPA
                </div>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Mekelle University
              </h2>
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-4">
                B.Sc. in Applied Computing Program
              </p>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Pursuing rigorous foundational computing studies with top-tier academic standing, maintaining a cumulative 3.86 GPA while leading peer computing labs and hands-on system builds.
              </p>

              {/* Academic Highlights */}
              <div className="space-y-3">
                {[
                  { label: 'Relational Database Architecture', sub: 'PostgreSQL, Normalization, Query Tuning' },
                  { label: 'Data Structures & Algorithms', sub: 'Algorithmic Efficiency & Complex Logic' },
                  { label: 'Systems Analysis & Design', sub: 'Enterprise Software Lifecycles' },
                  { label: 'Distributed Computing', sub: 'API Pipelines & Cross-Platform Sync' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-6 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-500" />
                <span>Dept. of Computing</span>
              </span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">High Academic Standing</span>
            </div>
          </div>

        </div>

        {/* =========================================================================
            BENTO SECTION 2: Leadership Spotlight (Full Width)
            ========================================================================= */}
        <div className="rounded-3xl glass-card card-shine p-7 sm:p-10 border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden mb-8">
          {/* Neon Ambient Background Halo */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-violet-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header with Organization & Role */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 text-white shadow-lg shadow-cyan-500/25">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Leadership Spotlight
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
                      Active Lead
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    NexTech Innovators — Technical Lead & Coordinator
                  </h2>
                </div>
              </div>

              {/* Quick Stat Island */}
              <div className="flex items-center gap-6 shrink-0 bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/50 dark:border-white/5">
                <div className="text-center">
                  <div className="text-2xl font-black text-cyan-500 dark:text-cyan-400">40+</div>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Students Mentored</div>
                </div>
                <div className="w-[1px] h-8 bg-slate-200 dark:bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-black text-violet-500 dark:text-violet-400">10+</div>
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Workshops Led</div>
                </div>
              </div>
            </div>

            {/* Narrative description */}
            <p className="text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8 max-w-4xl">
              As Technical Lead of <span className="font-bold text-slate-900 dark:text-white">NexTech Innovators</span>, I coordinate student engineering initiatives that empower developers to build practical, community-centered technology. My leadership focuses on cultivating software craftsmanship, conducting hands-on architectural code walkthroughs, and guiding developers through real production deployments.
            </p>

            {/* 4 Leadership Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {leadershipPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 border border-slate-200/50 dark:border-white/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    <span>{pillar.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* =========================================================================
            BENTO SECTION 3: Impact & Multi-Platform Reach (2 Columns)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          
          {/* Card Left: Production Systems Delivered */}
          <div className="rounded-2xl glass-card card-shine p-6 sm:p-8 flex flex-col justify-between border border-white/60 dark:border-white/10 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-3">
                <Building2 className="w-4 h-4 text-cyan-500" />
                <span>Production Systems Impact</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                Healthcare & Education Systems in Production
              </h3>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Hospital Management System</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    Automates clinic workflows, doctor-patient appointment bookings, encrypted medical histories, and pharmacy dispensing records with fine-grained access control.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">School Database Platform</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    Centralizes student academic records, automated GPA calculations, course prerequisite tracking, and administrative analytics dashboards.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Over 10+ Shipped Deployments</span>
              <Link to="/projects" className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1 hover:underline">
                <span>View All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card Right: Multi-Platform Engineering Reach */}
          <div className="rounded-2xl glass-card card-shine p-6 sm:p-8 flex flex-col justify-between border border-white/60 dark:border-white/10 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-3">
                <Layers className="w-4 h-4 text-violet-500" />
                <span>Multi-Platform Reach</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
                Cross-Platform Versatility & System Integration
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <Code2 className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Full-Stack Web</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    React, Node.js, Express, Tailwind & modern REST endpoints.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <Database className="w-3.5 h-3.5 text-violet-500" />
                    <span>Relational DBs</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PostgreSQL, Prisma ORM, strict schemas & indexing.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Android Mobile</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Android Studio, SQLite, and offline-first syncing.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <Monitor className="w-3.5 h-3.5 text-amber-500" />
                    <span>Desktop Systems</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Low latency, local storage & system utilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Architectural Depth</span>
              <Link to="/skills" className="text-violet-600 dark:text-violet-400 font-bold flex items-center gap-1 hover:underline">
                <span>Explore Skills Radar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* =========================================================================
            BOTTOM ACTION DOCK (Frosted Glass CTA Bar)
            ========================================================================= */}
        <div className="rounded-2xl glass-card card-shine p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Interested in collaborating or reviewing full credentials?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore the interactive verified dossier or get in touch for engineering roles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              to="/cv"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4" />
              <span>Explore Visual CV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 hover:border-cyan-500/40 transition-all duration-200"
            >
              <Send className="w-4 h-4 text-cyan-500" />
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
