import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Copy,
  Check,
  MapPin,
  Clock,
  Send,
  ExternalLink,
  Code2,
  Database,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';
import { useSystemSettings } from '../utils/systemSettings';
import contactService from '../services/contactService';

export default function Contact() {
  const { settings } = useSystemSettings();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    topic: 'Full-Stack Web Development',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const directEmail = 'tamratgher643@gmail.com';

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(directEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1800);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await contactService.submit({
        name: formState.name.trim(),
        email: formState.email.trim(),
        topic: formState.topic,
        message: formState.message.trim(),
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit message to backend:', err);
      setSubmitError(err.message || 'Failed to transmit message. Please try again or use direct email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      topic: 'Full-Stack Web Development',
      message: '',
    });
    setSubmitError(null);
  };

  const constructMailtoUrl = () => {
    const subject = encodeURIComponent(`[Project Inquiry] ${formState.topic} - ${formState.name || 'Client'}`);
    const body = encodeURIComponent(
      `Hello Tamrat,\n\nMy name is ${formState.name || '[Your Name]'}.\nEmail: ${formState.email || '[Your Email]'}\nTopic: ${formState.topic}\n\nProject Overview:\n${formState.message || '[Describe your project scope here]'}\n`
    );
    return `mailto:${directEmail}?subject=${subject}&body=${body}`;
  };

  const topics = [
    'Full-Stack Web Development',
    'Relational Database & PostgreSQL Architecture',
    'Android Mobile Application',
    'Cross-Platform / Desktop Software',
    'Technical Consultation / Other',
  ];

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28">
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
            <span>Get in Touch</span>
          </div>

          {/* Gradient Headline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
            Let's Build Something{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-600 dark:from-cyan-400 dark:via-sky-300 dark:to-violet-400">
              Impactful
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Have a software project, database architecture requirement, or engineering opportunity? Drop a message or reach out directly.
          </p>
        </div>

        {/* =========================================================================
            2-COLUMN RESPONSIVE LAYOUT (5 cols Left, 7 cols Right)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* =======================================================================
              LEFT COLUMN (5 Cols): Direct Channels & Collaboration Guide
              ======================================================================= */}
          <div className="lg:col-span-5 space-y-6">

            {/* Direct Channel Glass Card */}
            <div className="rounded-2xl glass-panel p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden">
              {/* Top ambient highlight */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

              {/* Live Availability Status */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border transition-all ${
                  settings.isOpenToWork
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    settings.isOpenToWork ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>
                  {settings.isOpenToWork
                    ? 'Available for Full-Stack, Database & Systems Contracts'
                    : 'Currently at Capacity / Focused on Core Engineering'}
                </span>
              </div>

              {/* Direct Email with One-Click Copy */}
              <div className="mb-6">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2">
                  Direct Email Contact
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5">
                  <a
                    href={`mailto:${directEmail}`}
                    className="text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors truncate mr-2"
                  >
                    {directEmail}
                  </a>

                  <button
                    type="button"
                    onClick={copyEmailToClipboard}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border transition-all ${
                      copiedEmail
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-emerald-500/10'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 border-slate-200/60 dark:border-white/10'
                    }`}
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Location & Response SLA */}
              <div className="space-y-3 pt-5 border-t border-slate-200/60 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Mekelle / Addis Ababa, Ethiopia (Global Remote Ready)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Guaranteed Response: <strong className="text-slate-900 dark:text-white">Within 24 Hours</strong></span>
                </div>
              </div>
            </div>

            {/* Developer Socials Island */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://github.com/YG-24-cyber"
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between p-4 rounded-2xl glass-panel border border-white/60 dark:border-white/10 shadow-lg hover:-translate-y-1 hover:border-cyan-500/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-900 text-white shadow-md">
                    <GithubIcon className="w-4 h-4" />
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                    GitHub Profile
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    @YG-24-cyber
                  </div>
                </div>
              </a>

              <a
                href="https://linkedin.com/in/tamrat-g-her-034642380"
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between p-4 rounded-2xl glass-panel border border-white/60 dark:border-white/10 shadow-lg hover:-translate-y-1 hover:border-violet-500/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
                    <LinkedinIcon className="w-4 h-4" />
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-400 transition-colors" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                    LinkedIn Network
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Tamrat G/her
                  </div>
                </div>
              </a>
            </div>

            {/* Collaboration Guide Box */}
            <div className="rounded-2xl glass-panel p-6 border border-white/60 dark:border-white/10 shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-3">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>Primary Collaboration Domains</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <Code2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">Full-Stack Web & Scalable APIs:</strong> React, Node.js, Express, and JWT Auth.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <Database className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">Relational Database Architecture:</strong> PostgreSQL, Prisma ORM, and ACID transactional integrity.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <Smartphone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">Cross-Platform Mobile & Desktop:</strong> Android Studio native builds, local SQLite, and desktop systems.
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* =======================================================================
              RIGHT COLUMN (7 Cols): Glassmorphic Message Form
              ======================================================================= */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-2xl relative overflow-hidden">
              {/* Backlight Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

              {/* Form Subhead */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/20">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Send an Engineering Message
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Direct transmission with fail-safe client fallback
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-bold">
                  24h SLA
                </span>
              </div>

              {isSubmitted ? (
                /* Success Alert State */
                <div className="py-10 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Message Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900 dark:text-white">{formState.name}</strong>. Your project inquiry regarding <strong className="text-cyan-500 dark:text-cyan-400">{formState.topic}</strong> has been noted. I'll get back to you within 24 hours.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Send Another Message</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Message Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
                      {submitError}
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Alex Johnson"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm glass-panel bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="e.g., alex@organization.com"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm glass-panel bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>

                  {/* Project Scope / Topic Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Project Scope / Topic
                    </label>
                    <select
                      name="topic"
                      value={formState.topic}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm glass-panel bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-200/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      {topics.map((topic) => (
                        <option key={topic} value={topic} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Project Overview & Requirements <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleInputChange}
                      placeholder="Outline your application requirements, database scale, timelines, or role details..."
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm glass-panel bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200/60 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-y"
                    />
                  </div>

                  {/* Action Controls: Submit Button + Email Client Fallback */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-lg shadow-cyan-500/25 dark:shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Transmitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>

                    {/* Pre-filled Email Client Fallback */}
                    <a
                      href={constructMailtoUrl()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 hover:border-cyan-500/40 transition-all duration-200"
                    >
                      <span>Open in Email Client</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
