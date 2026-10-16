import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ExternalLink,
  Code2,
  Database,
  Activity,
  ShoppingBag,
  TrendingUp,
  GraduationCap,
  Layers,
  CheckCircle2,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  Globe,
  Smartphone,
  Terminal,
  LayoutDashboard,
  Cpu,
  ShieldCheck,
  Wifi,
  Battery,
  Lock,
  RotateCw,
  Server,
  ArrowRight,
} from 'lucide-react';
import { projectCategories } from '../data/projectsData';
import projectService from '../services/projectService';
import { GithubIcon } from '../components/Icons';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All Work');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch projects from live PostgreSQL backend
  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectService.getAll();
        const projectList = Array.isArray(data?.projects) ? data.projects : Array.isArray(data) ? data : [];
        if (isMounted) {
          setProjects(projectList);
        }
      } catch (err) {
        console.error('Failed to load projects from backend API:', err);
        if (isMounted) {
          setError(err.message || 'Unable to connect to projects service.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        activeCategory === 'All Work' ||
        project.category?.toLowerCase() === activeCategory.toLowerCase();

      const query = searchTerm.toLowerCase().trim();
      const techList = Array.isArray(project.techStack)
        ? project.techStack
        : Array.isArray(project.stack)
        ? project.stack
        : [];

      const matchesSearch =
        query === '' ||
        project.title?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.category?.toLowerCase().includes(query) ||
        techList.some((tech) => tech.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchTerm]);

  // Helper to render high-fidelity glass preview mockups without external image dependencies
  const renderMockupPreview = (project) => {
    const pType = (project.previewArchetype || project.previewType || '').toLowerCase();
    const category = (project.category || '').toLowerCase();
    const statsValue = project.statsMetric || project.stats || 'Production Telemetry';

    // 1. Browser Shell Archetype (Web Apps)
    if (
      pType.includes('browser') ||
      pType.includes('web') ||
      category.includes('web')
    ) {
      return (
        <div className="w-full h-full p-2.5 bg-gradient-to-br from-cyan-950/40 via-slate-900/70 to-slate-950/90 flex flex-col justify-between font-mono text-[11px] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          {/* Top Browser URL Bar */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/80 border border-cyan-500/20 text-slate-400">
            <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
            <span className="text-[9px] text-cyan-300 font-medium truncate flex-1">
              https://cloud.{project.slug || 'app'}.tamrat.dev
            </span>
            <RotateCw className="w-2.5 h-2.5 text-slate-500 shrink-0" />
          </div>

          {/* Simulated Web App Viewport */}
          <div className="my-1.5 p-2 rounded-lg bg-slate-900/60 border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] font-sans font-semibold text-slate-200">
                  {project.title ? project.title.slice(0, 22) : 'Web App Cloud'}
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                HTTPS // 200 OK
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-0.5">
              <div className="p-1 rounded bg-white/5 text-center">
                <div className="text-[8px] text-slate-400">Vite SSR</div>
                <div className="text-[9px] font-bold text-emerald-400">&lt; 50ms</div>
              </div>
              <div className="p-1 rounded bg-white/5 text-center">
                <div className="text-[8px] text-slate-400">Responsive</div>
                <div className="text-[9px] font-bold text-cyan-400">PWA 100%</div>
              </div>
              <div className="p-1 rounded bg-white/5 text-center">
                <div className="text-[8px] text-slate-400">Security</div>
                <div className="text-[9px] font-bold text-violet-400">CSP A+</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Archetype: Browser Shell</span>
            </span>
            <span className="text-cyan-400 font-semibold">{statsValue}</span>
          </div>
        </div>
      );
    }

    // 2. Mobile Frame Archetype (Mobile Apps)
    if (
      pType.includes('mobile') ||
      category.includes('mobile') ||
      pType.includes('android') ||
      pType.includes('ios')
    ) {
      return (
        <div className="w-full h-full p-2.5 bg-gradient-to-br from-indigo-950/40 via-slate-900/70 to-slate-950/90 flex flex-col justify-between font-mono text-[11px] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          {/* Mobile Top Bar with Dynamic Island */}
          <div className="flex items-center justify-between px-1 text-[9px] text-slate-400">
            <span className="font-sans font-bold text-slate-300">09:41</span>
            {/* Dynamic Island */}
            <div className="px-3 py-0.5 rounded-full bg-slate-950 border border-white/20 flex items-center gap-1 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[8px] text-slate-300 font-semibold">Active</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi className="w-2.5 h-2.5 text-slate-300" />
              <Battery className="w-3 h-3 text-emerald-400" />
            </div>
          </div>

          {/* Mobile Card Interface */}
          <div className="my-1 p-2 rounded-xl bg-slate-900/70 border border-indigo-500/20 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] font-sans font-bold text-slate-200">
                  {project.title ? project.title.slice(0, 20) : 'Mobile Engine'}
                </span>
              </div>
              <span className="text-[8px] px-1 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                SQLite Offline
              </span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-slate-400 bg-white/5 px-1.5 py-1 rounded">
              <span>Sync Daemon</span>
              <span className="text-emerald-400 font-mono font-bold">100% Buffered</span>
            </div>
          </div>

          {/* Bottom Home Pill & Telemetry */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-full flex items-center justify-between text-[10px] text-slate-400">
              <span>Platform: Native/Cross</span>
              <span className="text-indigo-400 font-semibold">{statsValue}</span>
            </div>
            <div className="w-16 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      );
    }

    // 3. Desktop Terminal Archetype (Desktop Apps)
    if (
      pType.includes('terminal') ||
      pType.includes('desktop') ||
      category.includes('desktop')
    ) {
      return (
        <div className="w-full h-full p-2.5 bg-gradient-to-br from-emerald-950/40 via-slate-900/70 to-slate-950/90 flex flex-col justify-between font-mono text-[11px] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1 px-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Terminal className="w-3 h-3" />
              <span className="font-semibold tracking-wider text-[10px]">tamrat@desktop-engine:~</span>
            </div>
            <span className="text-[8px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              IPC // POSIX
            </span>
          </div>

          {/* Monospace Output */}
          <div className="my-1 p-2 rounded-lg bg-black/60 border border-emerald-500/15 space-y-0.5 text-[9px] text-slate-300">
            <div className="text-emerald-400 font-bold">
              $ ./bin/engine --inspect-runtime
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>[OK] Daemon online</span>
              <span className="text-emerald-400">p99: 14ms</span>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Memory Heap</span>
              <span className="text-cyan-400">42MB / Thread Safe</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>CLI / GUI Terminal</span>
            </span>
            <span className="text-emerald-400 font-semibold">{statsValue}</span>
          </div>
        </div>
      );
    }

    // 4. Enterprise ERP Archetype (ERP Systems)
    if (
      pType.includes('enterprise') ||
      pType.includes('erp') ||
      category.includes('erp') ||
      pType.includes('healthcare')
    ) {
      return (
        <div className="w-full h-full p-2.5 bg-gradient-to-br from-violet-950/40 via-slate-900/70 to-slate-950/90 flex flex-col justify-between font-mono text-[11px] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-violet-500/20 pb-1 px-1">
            <div className="flex items-center gap-1.5 text-violet-400">
              <LayoutDashboard className="w-3 h-3" />
              <span className="font-semibold tracking-wider text-[10px]">ERP // ENTERPRISE CORE</span>
            </div>
            <span className="text-[8px] px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-400 font-bold">
              ACID ENFORCED
            </span>
          </div>

          {/* Multi-Panel KPI Grid */}
          <div className="my-1 p-2 rounded-lg bg-slate-900/60 border border-violet-500/20 space-y-1 text-[9px]">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-violet-300 font-semibold">Ledger Pipeline</span>
              <span className="text-emerald-400 font-bold">99.98% High SLA</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 w-[92%]" />
            </div>
            <div className="flex justify-between text-slate-400 pt-0.5">
              <span>RBAC Matrix: Enforced</span>
              <span className="text-cyan-300 font-medium">Zero-Leak Schema</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Core: Relational Postgres</span>
            <span className="text-violet-400 font-semibold">{statsValue}</span>
          </div>
        </div>
      );
    }

    // 5. Custom Architecture Node Graph Archetype (Other / Fallback)
    return (
      <div className="w-full h-full p-2.5 bg-gradient-to-br from-amber-950/40 via-slate-900/70 to-slate-950/90 flex flex-col justify-between font-mono text-[11px] relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-1 px-1">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Cpu className="w-3 h-3" />
            <span className="font-semibold tracking-wider text-[10px]">SYSTEM // ARCHITECTURE</span>
          </div>
          <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
            DISTRIBUTED
          </span>
        </div>

        {/* Node Architecture Preview */}
        <div className="my-1 p-2 rounded-lg bg-slate-900/60 border border-amber-500/15 flex items-center justify-between text-[9px]">
          <div className="p-1 rounded bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-amber-300 font-bold">Client UI</div>
            <div className="text-[8px] text-slate-400">TLS 1.3</div>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-500 animate-pulse" />
          <div className="p-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-center">
            <div className="text-cyan-300 font-bold">API Mesh</div>
            <div className="text-[8px] text-slate-400">REST/gRPC</div>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-500 animate-pulse" />
          <div className="p-1 rounded bg-violet-500/10 border border-violet-500/20 text-center">
            <div className="text-violet-300 font-bold">PostgreSQL</div>
            <div className="text-[8px] text-slate-400">ACID B-Tree</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Infra: Scalable Nodes</span>
          <span className="text-amber-400 font-semibold">{statsValue}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* =========================================================================
            HEADER & TAGLINE
            ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          {/* Frosted Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400 mb-4 shadow-sm shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Crafted Solutions & System Architecture</span>
          </div>

          {/* Big Bold Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
            Featured{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-600 dark:from-cyan-400 dark:via-sky-300 dark:to-violet-400">
              Engineering Projects
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
            Scalable hospital management systems, robust database schemas, and modern web applications engineered with architectural integrity and clean code.
          </p>
        </div>

        {/* =========================================================================
            CONTROLS: Search + Category Filter Pill Bar (Floating Island)
            ========================================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Real-time Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title, stack, keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm glass-panel text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-white/60 dark:border-white/10"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                &times;
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="rounded-2xl glass-panel p-1.5 border border-white/60 dark:border-white/10 shadow-lg flex items-center gap-1.5 overflow-x-auto max-w-full">
            {projectCategories.map((cat) => {
              const isActive = activeCategory === cat;
              const count =
                cat === 'All Work'
                  ? projects.length
                  : projects.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/25 ring-1 ring-white/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            BENTO GRID / CARD GALLERY (3 Columns on lg)
            ========================================================================= */}
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl glass-panel p-5 border border-white/60 dark:border-white/10 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-slate-300/40 dark:bg-slate-700/40 rounded-full" />
                  <div className="h-4 w-16 bg-slate-300/40 dark:bg-slate-700/40 rounded-full" />
                </div>
                <div className="aspect-video rounded-xl bg-slate-300/30 dark:bg-slate-800/60" />
                <div className="h-6 w-3/4 bg-slate-300/40 dark:bg-slate-700/40 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-300/30 dark:bg-slate-800/50 rounded" />
                  <div className="h-3 w-5/6 bg-slate-300/30 dark:bg-slate-800/50 rounded" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-slate-300/30 dark:bg-slate-800/40 rounded-md" />
                  <div className="h-6 w-20 bg-slate-300/30 dark:bg-slate-800/40 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="rounded-2xl glass-panel p-10 text-center border border-rose-500/20 max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
              Unable to Retrieve Live Projects
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {error}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 shadow-md shadow-cyan-500/20"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project) => {
              const techList = Array.isArray(project.techStack)
                ? project.techStack
                : Array.isArray(project.stack)
                ? project.stack
                : [];
              const statusLabel =
                project.status?.toUpperCase() === 'ACTIVE' ? 'Active' : 'Production';

              return (
                <div
                  key={project.id}
                  className="group relative rounded-2xl glass-card card-shine p-6 flex flex-col justify-between border border-white/60 dark:border-white/10 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 dark:hover:border-cyan-500/30"
                >
                  {/* Top ambient hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/5 to-transparent dark:from-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div>
                    {/* Card Header: Category & Status Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400">
                        {project.category}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          statusLabel === 'Active'
                            ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            statusLabel === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-violet-500'
                          }`}
                        />
                        <span>{statusLabel}</span>
                      </span>
                    </div>

                    {/* Card Preview Viewport */}
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-slate-200/60 dark:border-white/10 shadow-inner bg-slate-900">
                      {/* Window Controls */}
                      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                        <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>

                      {renderMockupPreview(project)}
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* Problem-Solution Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom Section: Tech Stack Pills & Action Dock */}
                  <div className="space-y-4 pt-3 border-t border-slate-200/60 dark:border-white/10">
                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Dock */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={project.liveUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-200"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={project.githubUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100/80 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 hover:border-cyan-500/40 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all duration-200"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl glass-panel p-12 text-center border border-white/60 dark:border-white/10 max-w-md mx-auto">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-60" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No matching projects
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Try adjusting your search criteria or domain filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All Work');
                setSearchTerm('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 shadow-md shadow-cyan-500/20"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
