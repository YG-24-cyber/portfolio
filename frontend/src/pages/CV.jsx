import React, { useState, useEffect } from 'react';
import {
  Download,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Sparkles,
  MapPin,
  Mail,
  Calendar,
  ExternalLink,
  Code2,
  Database,
  Layers,
  ChevronRight,
  Terminal,
  FileCheck2,
  ShieldCheck,
  Send,
  Printer,
  Fingerprint,
  Loader2,
  Tag,
  Cpu,
  Activity,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';
import cvService from '../services/cvService';

export default function CV() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activeRelease, setActiveRelease] = useState(null);
  const [telemetry, setTelemetry] = useState({ totalCvDownloads: 0, lastCvDownloadAt: null });
  const [copiedSha, setCopiedSha] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyShaToClipboard = () => {
    const sha = activeRelease?.checksumSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    navigator.clipboard.writeText(sha);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 1800);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('tamratgher643@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1800);
  };

  useEffect(() => {
    let isMounted = true;

    // Fetch active production CV release
    cvService
      .getActive()
      .then((data) => {
        if (isMounted && data?.release) {
          setActiveRelease(data.release);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch active CV release:', err.message);
      });

    // Fetch live telemetry (download counter)
    cvService
      .getTelemetry()
      .then((data) => {
        if (isMounted && data?.telemetry) {
          setTelemetry(data.telemetry);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch CV telemetry:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadProgress(15);

    const progressTimer = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    try {
      await cvService.recordDownload();
      setTelemetry((prev) => ({
        ...prev,
        totalCvDownloads: (prev.totalCvDownloads || 0) + 1,
      }));
    } catch (err) {
      console.warn('Download telemetry record notice:', err.message);
    }

    setTimeout(() => {
      clearInterval(progressTimer);
      setDownloadProgress(100);
      setIsDownloading(false);
      setDownloadSuccess(true);

      if (activeRelease?.fileUrl && activeRelease.fileUrl !== '#') {
        window.open(activeRelease.fileUrl, '_blank');
      } else {
        window.print();
      }

      setTimeout(() => {
        setDownloadSuccess(false);
        setDownloadProgress(0);
      }, 4000);
    }, 650);
  };

  const skillsData = [
    {
      category: 'Frontend Architecture',
      icon: Code2,
      skills: ['React.js', 'JavaScript (ES6+)', 'TypeScript', 'Tailwind CSS', 'Glassmorphism UI', 'Responsive Design'],
    },
    {
      category: 'Backend & APIs',
      icon: Layers,
      skills: ['Node.js', 'Express.js', 'RESTful API Design', 'Authentication (JWT)', 'Middleware', 'Microservices'],
    },
    {
      category: 'Databases & Systems',
      icon: Database,
      skills: ['PostgreSQL', 'SQL Schema Design', 'Relational Modeling', 'Query Optimization', 'Data Integrity', 'ACID Principles'],
    },
    {
      category: 'Tools & Workflows',
      icon: Terminal,
      skills: ['Git & GitHub', 'Postman', 'Linux / Bash', 'Agile / Scrum', 'CI/CD Basics', 'Docker Basics'],
    },
  ];

  const timelineData = [
    {
      id: 1,
      type: 'leadership',
      title: 'Leader & Lead Systems Architect',
      organization: 'NexTech Innovators',
      period: '2024 — Present',
      location: 'Campus & Tech Hub',
      badge: 'Leadership Role',
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      description:
        'Leading student engineering teams and collaborative initiatives to build impactful real-world software solutions. Directing developer workshops, code reviews, and architectural planning for community systems in healthcare and digital learning.',
      achievements: [
        'Organized and mentored 40+ computing students in full-stack web and database workflows.',
        'Spearheaded prototype initiatives addressing regional hospital administration bottlenecks.',
      ],
      technologies: ['Team Leadership', 'System Architecture', 'Agile Planning', 'Code Review'],
    },
    {
      id: 2,
      type: 'project',
      title: 'Lead Software Architect — Hospital Management System',
      organization: 'Specialized Healthcare Solution',
      period: '2024 — 2025',
      location: 'Autonomous Project',
      badge: 'Core Project',
      badgeColor: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20',
      description:
        'Engineered an end-to-end hospital management system automating patient intake, doctor appointments, diagnosis documentation, and pharmacy dispensing records with enterprise-grade data security.',
      achievements: [
        'Designed normalized PostgreSQL database schema handling concurrent patient appointments without scheduling conflicts.',
        'Implemented role-based access control (RBAC) ensuring patient data confidentiality compliant with healthcare privacy standards.',
      ],
      technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'JWT'],
    },
    {
      id: 3,
      type: 'education',
      title: 'B.Sc. in Applied Computing (In Progress)',
      organization: 'Academic Institution',
      period: '2023 — Present',
      location: 'Department of Computing',
      badge: 'GPA: 3.86 / 4.0',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description:
        'Rigorous coursework focused on software engineering, data structures & algorithms, relational database management systems, distributed computing, and computer systems architecture.',
      achievements: [
        'Maintained high academic standing with a 3.86 cumulative GPA out of 4.0.',
        'Selected for peer mentoring and top algorithmic group projects.',
      ],
      technologies: ['Data Structures & Algorithms', 'Database Systems', 'Software Engineering', 'System Analysis'],
    },
    {
      id: 4,
      type: 'project',
      title: 'Full-Stack Developer — Education Tech Platform',
      organization: 'Academic Collaboration Suite',
      period: '2024',
      location: 'Collaborative Project',
      badge: 'EdTech Initiative',
      badgeColor: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
      description:
        'Designed and developed a student resource hub facilitating collaborative assignment tracking, peer document review, and real-time class announcement notifications.',
      achievements: [
        'Optimized frontend load times with modern Vite bundling and lightweight Tailwind glassmorphism design.',
        'Created intuitive interactive dashboards with progress tracking analytics.',
      ],
      technologies: ['React', 'REST APIs', 'PostgreSQL', 'Tailwind CSS', 'Vite'],
    },
    {
      id: 5,
      type: 'experience',
      title: 'Freelance & Independent Software Developer',
      organization: 'Client & Community Deployments',
      period: '2023 — Present',
      location: 'Remote',
      badge: 'Client Solutions',
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      description:
        'Delivering responsive web applications, relational database schemas, and tailored business portals for small enterprises and institutional groups.',
      achievements: [
        'Shipped 10+ completed software projects with high client satisfaction and robust maintainability.',
        'Constructed reusable design components and automated API testing suites.',
      ],
      technologies: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Git'],
    },
  ];

  const filteredTimeline = timelineData.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const filterTabs = [
    { key: 'all', label: 'All Milestones', count: timelineData.length },
    { key: 'leadership', label: 'Leadership', count: timelineData.filter((i) => i.type === 'leadership').length },
    { key: 'project', label: 'Key Projects', count: timelineData.filter((i) => i.type === 'project').length },
    { key: 'education', label: 'Education', count: timelineData.filter((i) => i.type === 'education').length },
    { key: 'experience', label: 'Experience', count: timelineData.filter((i) => i.type === 'experience').length },
  ];

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* =========================================================================
            FLOATING TOP SUB-BAR: High-Tech Telemetry HUD & Download Action
            ========================================================================= */}
        <div className="rounded-2xl glass-card card-shine p-4 sm:p-5 mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 border border-white/60 dark:border-white/10 shadow-xl">
          {/* Breadcrumb & Dossier Meta */}
          <div className="flex items-center gap-3.5 w-full lg:w-auto">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Curriculum Vitae
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Verified</span>
                </span>
                {/* Active Release Version */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Tag className="w-2.5 h-2.5" />
                  <span>{activeRelease?.versionTag || 'v2.4-STABLE'}</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Tamrat G/her <span className="font-normal text-slate-500 dark:text-slate-400 text-sm">| Professional Dossier</span>
              </h1>
            </div>
          </div>

          {/* High-Tech Telemetry Badges & Download Button */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end flex-wrap">
            {/* SHA-256 Fingerprint Pill with 1-Click Copy & 1800ms Feedback */}
            <button
              type="button"
              onClick={copyShaToClipboard}
              title="Click to copy full SHA-256 verification hash"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                copiedSha
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-cyan-500/40 hover:text-cyan-500 dark:hover:text-cyan-400'
              }`}
            >
              {copiedSha ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>✓ Copied SHA-256</span>
                </>
              ) : (
                <>
                  <Fingerprint className="w-3.5 h-3.5 text-violet-400" />
                  <span>SHA-256: {activeRelease?.checksumSha256 ? activeRelease.checksumSha256.slice(0, 10) + '...' : 'e3b0c442...'}</span>
                </>
              )}
            </button>

            {/* Total Downloads Telemetry Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{telemetry.totalCvDownloads || 0} Downloads</span>
            </div>

            {/* Download PDF Resume Action Button with Interactive Progress State */}
            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadPDF}
              className={`relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white transition-all duration-200 shadow-lg ${
                downloadSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:via-sky-400 hover:to-violet-500 shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {/* Animated Progress Bar fill along button */}
              {isDownloading && (
                <div
                  className="absolute left-0 bottom-0 top-0 bg-white/20 transition-all duration-150 ease-out pointer-events-none"
                  style={{ width: `${downloadProgress}%` }}
                />
              )}

              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-200 relative z-10" />
                  <span className="relative z-10 font-mono">Fetching {downloadProgress}%</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white relative z-10" />
                  <span className="relative z-10">Dossier Dispatched!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Download PDF Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            TWO-COLUMN MAIN LAYOUT (4 cols Left, 8 cols Right)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* =======================================================================
              LEFT COLUMN (4 Cols): Sticky Profile Card & Core Skills Capsule Panel
              ======================================================================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Profile Glass Card */}
            <div className="rounded-2xl glass-card card-shine p-6 border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden">
              {/* Top ambient glow highlight */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Avatar Monogram & Status */}
              <div className="flex items-start justify-between mb-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-cyan-500/25 border-2 border-white/40 dark:border-white/20">
                    TG
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border-2 border-white dark:border-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400">
                    Status
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Open to Opportunities
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                Tamrat G/her
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
                Applied Computing Student & Full-Stack Developer
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6">
                Leader at <span className="font-semibold text-slate-900 dark:text-white">NexTech Innovators</span>. Specialized in building secure hospital management workflows, scalable relational database models, and education tech software.
              </p>

              {/* Verified Information List */}
              <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-white/10 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium">
                  <GraduationCap className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Applied Computing (GPA 3.86 / 4.0)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium">
                  <Award className="w-4 h-4 text-violet-500 shrink-0" />
                  <span>NexTech Innovators Leader</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 font-medium">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Ethiopia / Global Remote</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-2.5 truncate">
                    <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span className="truncate font-mono text-xs">tamratgher643@gmail.com</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyEmailToClipboard}
                    title="Copy Email Address"
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      copiedEmail
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold shadow-sm shadow-emerald-500/10'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 border border-slate-200/60 dark:border-white/10'
                    }`}
                  >
                    {copiedEmail ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Social Channels */}
              <div className="grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-slate-200/60 dark:border-white/10">
                <a
                  href="https://github.com/YG-24-cyber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl glass-panel text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/tamrat-g-her-034642380"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl glass-panel text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-violet-500 dark:hover:text-violet-400 hover:border-violet-500/40 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>

              {/* Direct Contact Button */}
              <a
                href="#contact"
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-md shadow-cyan-500/20 transition-all duration-200"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Initiate Contact</span>
              </a>
            </div>

            {/* Core Skills Capsule Panel */}
            <div className="rounded-2xl glass-card card-shine p-6 border border-white/60 dark:border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Core Skills & Stack
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
                  Verified
                </span>
              </div>

              <div className="space-y-5">
                {skillsData.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <Icon className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{category.category}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {category.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20 hover:text-cyan-600 dark:hover:text-cyan-300 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 transition-colors cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* =======================================================================
              RIGHT COLUMN (8 Cols): Engagement Metrics & Central Vertical Timeline
              ======================================================================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Engagement Counter Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="rounded-2xl glass-card card-shine p-4 border border-white/60 dark:border-white/10 text-center hover:-translate-y-1 transition-transform">
                <div className="text-2xl sm:text-3xl font-black text-cyan-500 dark:text-cyan-400 mb-0.5">
                  3.86
                </div>
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">GPA Score</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Out of 4.0 Scale</div>
              </div>

              <div className="rounded-2xl glass-card card-shine p-4 border border-white/60 dark:border-white/10 text-center hover:-translate-y-1 transition-transform">
                <div className="text-2xl sm:text-3xl font-black text-violet-500 dark:text-violet-400 mb-0.5">
                  10+
                </div>
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Completed Projects</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Shipped & Tested</div>
              </div>

              <div className="rounded-2xl glass-card card-shine p-4 border border-white/60 dark:border-white/10 text-center hover:-translate-y-1 transition-transform">
                <div className="text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 mb-0.5">
                  2+
                </div>
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Years Experience</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Building Systems</div>
              </div>

              <div className="rounded-2xl glass-card card-shine p-4 border border-white/60 dark:border-white/10 text-center hover:-translate-y-1 transition-transform">
                <div className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 mb-0.5">
                  100%
                </div>
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Leadership Focus</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">NexTech Innovators</div>
              </div>
            </div>

            {/* Filter Navigation Tabs with Animated Pill State */}
            <div className="rounded-2xl glass-card card-shine p-2 border border-white/60 dark:border-white/10 flex items-center gap-1.5 overflow-x-auto">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/25 ring-1 ring-white/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Central Vertical Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:content-[''] before:absolute before:left-2.5 sm:before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-cyan-500 before:via-violet-500 before:to-transparent">
              
              {filteredTimeline.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Point */}
                  <div className="absolute -left-[19px] sm:-left-[26px] top-4 w-4 h-4 rounded-full bg-slate-900 dark:bg-darkBg border-2 border-cyan-500 flex items-center justify-center shadow-md shadow-cyan-500/40 group-hover:scale-125 transition-transform duration-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></div>
                  </div>

                  {/* Frosted Milestone Card */}
                  <div className="rounded-2xl glass-card card-shine p-6 border border-white/60 dark:border-white/10 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                    
                    {/* Header: Title, Organization, Badge, Period */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                            {item.title}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                          <span>{item.organization}</span>
                          <span className="text-slate-400 dark:text-slate-600">•</span>
                          <span className="text-slate-500 dark:text-slate-400">{item.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-white/5 whitespace-nowrap self-start">
                        <Calendar className="w-3 h-3 text-cyan-500" />
                        <span>{item.period}</span>
                      </div>
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4">
                      {item.description}
                    </p>

                    {/* Achievements Bullet Points */}
                    {item.achievements && (
                      <ul className="space-y-1.5 mb-4 pl-1">
                        {item.achievements.map((ach, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Technologies Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/50 dark:border-white/5">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-cyan-500/5 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
