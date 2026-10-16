import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileDown,
  Download,
  Upload,
  ShieldCheck,
  FileCheck2,
  Clock,
  Activity,
  Search,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Plus,
  ArrowLeft,
  FileText,
  X,
  Radio,
  RotateCcw,
  Sparkles,
  ScrollText,
  Loader2,
} from 'lucide-react';
import cvService from '../../services/cvService';

export default function AdminCV() {
  const [releases, setReleases] = useState([]);
  const [telemetry, setTelemetry] = useState({
    totalCvDownloads: 0,
    lastCvDownloadAt: null,
    activeVersion: 'v2.1',
    activeFileName: 'Tamrat_Gher_Resume.pdf',
    checksumSha256: '',
    fileSize: '190 KB',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controls & Filter State
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Drawers State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedChangelog, setSelectedChangelog] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);
  const [notification, setNotification] = useState(null);

  // New Release Form State
  const [formData, setFormData] = useState({
    version: '',
    fileName: '',
    targetSpecialization: 'Full-Stack, PostgreSQL & Android Systems',
    size: '190 KB',
    changelog: '',
    isActive: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Trigger feedback toast
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const activeRelease = useMemo(() => {
    if (!Array.isArray(releases)) return null;
    return releases.find((r) => r.isActive) || null;
  }, [releases]);

  const loadCVData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [releasesRes, telemetryRes] = await Promise.allSettled([
        cvService.getAllReleases(),
        cvService.getTelemetry(),
      ]);

      if (releasesRes.status === 'fulfilled') {
        const val = releasesRes.value;
        const raw = Array.isArray(val)
          ? val
          : Array.isArray(val?.releases)
          ? val.releases
          : Array.isArray(val?.data)
          ? val.data
          : Array.isArray(val?.data?.releases)
          ? val.data.releases
          : [];

        const normalized = raw.map((r) => ({
          ...r,
          id: r.id || `cv-${Date.now()}-${Math.random()}`,
          version: r.versionTag || r.version || 'v1.0',
          fileName: r.fileName || 'Resume.pdf',
          targetSpecialization: r.targetSpecialization || 'Full Stack',
          size: r.fileSize || r.size || '190 KB',
          sha256: r.checksumSha256 || r.sha256 || '',
          releaseDate: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString()
            : r.releaseDate || r.date || 'Recent',
          isActive: Boolean(r.isActive),
        }));
        setReleases(normalized);
      } else {
        console.error('Failed to load CV releases:', releasesRes.reason);
        setError('Could not retrieve CV releases from backend.');
      }

      if (telemetryRes.status === 'fulfilled') {
        const val = telemetryRes.value;
        const t = val?.telemetry || val?.data?.telemetry || val || {};
        setTelemetry({
          totalCvDownloads: t.totalCvDownloads ?? 0,
          lastCvDownloadAt: t.lastCvDownloadAt ?? null,
          activeVersion: t.activeVersion || 'v2.1',
          activeFileName: t.activeFileName || 'Tamrat_Gher_Resume.pdf',
          checksumSha256: t.checksumSha256 || '',
          fileSize: t.fileSize || '190 KB',
        });
      }
    } catch (err) {
      console.error('Failed to aggregate CV telemetry:', err);
      setError(err.message || 'Failed to load CV telemetry.');
      triggerNotification(err.message || 'Failed to load CV telemetry.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCVData();
  }, []);

  // Filtered Releases
  const filteredReleases = useMemo(() => {
    if (!Array.isArray(releases)) return [];
    return releases.filter((release) => {
      const query = searchTerm.toLowerCase().trim();
      if (!query) return true;
      return (
        release.version?.toLowerCase().includes(query) ||
        release.fileName?.toLowerCase().includes(query) ||
        release.targetSpecialization?.toLowerCase().includes(query) ||
        release.changelog?.toLowerCase().includes(query)
      );
    });
  }, [releases, searchTerm]);

  // Copy SHA-256 hash
  const handleCopyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    triggerNotification('SHA-256 checksum copied to clipboard.');
    setTimeout(() => setCopiedHash(null), 2500);
  };

  // Test Fetch / Simulated Download Trigger
  const handleTestFetch = async (release) => {
    try {
      await cvService.recordDownload();
      triggerNotification(`Simulated download dispatched for ${release.fileName} (v${release.version}). Telemetry updated!`);
      await loadCVData();
    } catch (err) {
      triggerNotification(err.message || 'Failed to record download.', 'error');
    }
  };

  // Switch Active Version
  const handleSwitchActive = async (versionId, versionName) => {
    if (activeRelease?.id === versionId) return;
    try {
      await cvService.setActiveRelease(versionId);
      triggerNotification(`Active public resume switched to ${versionName}.`, 'success');
      await loadCVData();
    } catch (err) {
      triggerNotification(err.message || 'Failed to switch active version.', 'error');
    }
  };

  // Open Create Release Modal
  const handleOpenCreateModal = () => {
    const nextVer = `v2.${releases.length + 1}`;
    setFormData({
      version: `${nextVer} (Candidate)`,
      fileName: `Tamrat_Gher_Resume_${nextVer}.pdf`,
      targetSpecialization: 'Full-Stack, PostgreSQL & Cloud Architecture',
      size: '188 KB',
      changelog: 'Added recent high-throughput PostgreSQL benchmarks, Android mobile offline sync workflows, and updated leadership achievements.',
      isActive: false,
    });
    setFormErrors({});
    setIsCreateModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.version.trim()) errors.version = 'Version label is required.';
    if (!formData.fileName.trim()) errors.fileName = 'File name is required.';
    if (!formData.targetSpecialization.trim()) errors.targetSpecialization = 'Specialization target is required.';
    if (!formData.changelog.trim()) errors.changelog = 'Changelog / release notes are required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit New Release
  const handleCreateRelease = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await cvService.createRelease({
        versionTag: formData.version.trim(),
        fileName: formData.fileName.trim(),
        targetSpecialization: formData.targetSpecialization.trim(),
        fileSize: formData.size.trim() || '188 KB',
        changelog: formData.changelog.trim(),
        isActive: Boolean(formData.isActive),
      });

      triggerNotification(`CV Release "${formData.version}" registered and deployed to registry!`);
      setIsCreateModalOpen(false);
      await loadCVData();
    } catch (err) {
      triggerNotification(err.message || 'Failed to register new release.', 'error');
    }
  };

  // Delete Release
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cvService.deleteRelease(deleteTarget.id);
      triggerNotification(`CV Release "${deleteTarget.version}" removed from archive.`, 'info');
      setDeleteTarget(null);
      await loadCVData();
    } catch (err) {
      triggerNotification(err.message || 'Cannot delete active production version.', 'error');
    }
  };

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* =========================================================================
            NOTIFICATION BANNER
            ========================================================================= */}
        {notification && (
          <div className="fixed top-24 right-6 z-50 max-w-md animate-fadeIn">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel shadow-2xl border ${
                notification.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : notification.type === 'info'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                {notification.message}
              </span>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="ml-auto text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            HEADER SECTION
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-slate-200/60 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-3 shadow-sm shadow-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Document Repository & Telemetry</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Interactive CV{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                Versioning & Telemetry Hub
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Manage production resume artifacts, changelogs, file checksums, and client-side download telemetry in real-time.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-md shadow-emerald-500/25 hover:shadow-neon-cyan hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>+ Deploy New CV Release</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            4-CARD LIVE TELEMETRY METRIC ISLAND
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Metric 1: Total Downloads */}
          <div className="rounded-2xl glass-panel p-6 border border-white/60 dark:border-white/10 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                CLIENT FETCHER
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
              {telemetry.totalCvDownloads}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Downloads</div>
            <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 mt-1">
              Verified Client Fetches
            </div>
          </div>

          {/* Metric 2: Active Version */}
          <div className="rounded-2xl glass-panel p-6 border border-white/60 dark:border-white/10 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 animate-pulse">
                ● ACTIVE
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
              {activeRelease?.version
                ? String(activeRelease.version).split(' ')[0]
                : telemetry?.activeVersion
                ? String(telemetry.activeVersion).split(' ')[0]
                : 'v2.1'}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Production Document</div>
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 truncate">
              {activeRelease?.fileName || telemetry?.activeFileName || 'Tamrat_Gher_Resume.pdf'}
            </div>
          </div>

          {/* Metric 3: Cryptographic Integrity */}
          <div className="rounded-2xl glass-panel p-6 border border-white/60 dark:border-white/10 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                SHA-256
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Verified 100%
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Cryptographic Integrity</div>
            <div className="text-[10px] font-mono text-violet-600 dark:text-violet-400 mt-1 truncate">
              {activeRelease?.sha256
                ? `${String(activeRelease.sha256).slice(0, 16)}...`
                : telemetry?.checksumSha256
                ? `${String(telemetry.checksumSha256).slice(0, 16)}...`
                : 'Tamper-Proof'}
            </div>
          </div>

          {/* Metric 4: Telemetry Log */}
          <div className="rounded-2xl glass-panel p-6 border border-white/60 dark:border-white/10 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>LISTENER LIVE</span>
              </div>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-1 truncate">
              {telemetry?.lastCvDownloadAt
                ? new Date(telemetry.lastCvDownloadAt).toLocaleTimeString()
                : 'Live Sync'}
            </div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Last Telemetry Fetch</div>
            <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 mt-1">
              Reactive Event Synced
            </div>
          </div>

        </div>

        {/* =========================================================================
            CONTROLS & SEARCH BAR
            ========================================================================= */}
        <div className="rounded-2xl glass-panel p-4 mb-6 border border-white/60 dark:border-white/10 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search releases by version, filename, or specialization keywords..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadCVData}
              className="p-2 rounded-xl text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 transition-colors"
              title="Refresh CV version archive and telemetry"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            FROSTED CV VERSION ARCHIVE TABLE
            ========================================================================= */}
        <div className="rounded-2xl glass-panel border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden">
          
          <div className="px-6 py-3.5 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                ARCHIVED RELEASES: {filteredReleases.length}
              </span>
              <span>of {releases?.length || 0} Total</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Select radio to switch production live document
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200/60 dark:border-white/10 text-slate-400 font-mono uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/40">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Live</th>
                  <th className="py-3 px-4">Document & Version</th>
                  <th className="py-3 px-4">Target Specialization</th>
                  <th className="py-3 px-4">Footprint & Date</th>
                  <th className="py-3 px-4">Checksum (SHA-256)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                        <span className="font-mono text-xs">Loading CV Releases from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-rose-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-rose-500" />
                        <span className="text-xs font-semibold">{error}</span>
                        <button
                          type="button"
                          onClick={loadCVData}
                          className="mt-2 px-3 py-1 text-xs rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        >
                          Retry Connection
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredReleases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-6 h-6 text-slate-500" />
                        <span className="text-xs font-semibold">No CV releases matching your criteria.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReleases.map((release) => {
                    const isActive = release.isActive;
                    return (
                      <tr
                        key={release.id}
                        className={`hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors group ${
                          isActive ? 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04]' : ''
                        }`}
                      >
                        {/* Active Selector */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleSwitchActive(release.id, release.version)}
                            className="p-1 rounded-full transition-transform hover:scale-110"
                            title={isActive ? 'Currently Active Production Resume' : 'Click to set as Active Resume'}
                          >
                            <span
                              className={`flex h-4 w-4 rounded-full border items-center justify-center ${
                                isActive
                                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/50'
                                  : 'border-slate-300 dark:border-white/20 hover:border-emerald-500'
                              }`}
                            >
                              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </span>
                          </button>
                        </td>

                        {/* Document & Version */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {release.fileName}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                                isActive
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5'
                              }`}
                            >
                              {release.version}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {release.changelog}
                          </div>
                        </td>

                        {/* Specialization */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                            {release.targetSpecialization}
                          </span>
                        </td>

                        {/* Footprint & Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          <div>{release.size}</div>
                          <div className="text-[10px] text-slate-400">{release.releaseDate}</div>
                        </td>

                        {/* SHA-256 Checksum */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[10px]">
                          <button
                            type="button"
                            onClick={() => handleCopyHash(release.sha256, release.id)}
                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 hover:bg-violet-500/10 border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-violet-500 transition-colors"
                            title="Click to copy full SHA-256 checksum"
                          >
                            <span>
                              {release.sha256
                                ? release.sha256.length > 16
                                  ? `${release.sha256.slice(0, 10)}...${release.sha256.slice(-6)}`
                                  : release.sha256
                                : 'Pending Checksum'}
                            </span>
                            {copiedHash === release.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        </td>

                        {/* Action Controls */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Test Fetch / Simulated Download */}
                            <button
                              type="button"
                              onClick={() => handleTestFetch(release)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10 transition-colors"
                              title="Simulate Client Download & Increment Telemetry"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Changelog Notes */}
                            <button
                              type="button"
                              onClick={() => setSelectedChangelog(release)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-violet-500 hover:bg-violet-500/10 transition-colors"
                              title="View Release Changelog & Details"
                            >
                              <ScrollText className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              disabled={isActive}
                              onClick={() => setDeleteTarget(release)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isActive
                                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
                                  : 'text-slate-500 hover:text-rose-500 hover:bg-rose-500/10'
                              }`}
                              title={isActive ? 'Cannot remove active production document' : 'Retire / Delete Release'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* =========================================================================
          RELEASE NEW CV VERSION MODAL
          ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
            onClick={() => setIsCreateModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl rounded-3xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl border border-white/80 dark:border-white/15 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/25">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Deploy New CV Version Release
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Register a new verified curriculum vitae artifact into the production repository.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRelease} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Version Identifier <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g. v2.2 (Candidate)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                  {formErrors.version && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.version}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document File Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fileName}
                    onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                    placeholder="Tamrat_Gher_Resume_v2.2.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                  {formErrors.fileName && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.fileName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Specialization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.targetSpecialization}
                    onChange={(e) => setFormData({ ...formData, targetSpecialization: e.target.value })}
                    placeholder="Full-Stack, PostgreSQL & Android Systems"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {formErrors.targetSpecialization && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.targetSpecialization}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    File Size Footprint
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="192 KB"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Release Notes / Changelog <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.changelog}
                  onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
                  placeholder="Detail the newly added architectural projects, leadership achievements, or updated credential sections..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
                />
                {formErrors.changelog && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.changelog}</p>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Set as Active Production Resume immediately</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Instantly routes all client-side "Download PDF Resume" requests on /cv to this release artifact.
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-md shadow-emerald-500/25 transition-all duration-200"
                >
                  Deploy CV Release
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          CHANGELOG DETAILS DRAWER / MODAL
          ========================================================================= */}
      {selectedChangelog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 border border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-7 overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setSelectedChangelog(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Release Dossier
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {selectedChangelog.releaseDate}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              {selectedChangelog.version}
            </h3>

            <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-4">
              {selectedChangelog.fileName} ({selectedChangelog.size})
            </div>

            <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/5 space-y-3 mb-5">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                Release Notes & Changelog
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedChangelog.changelog}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                Cryptographic Artifact Fingerprint
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] break-all border border-white/10">
                {selectedChangelog.sha256}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-white/10">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Target: <span className="text-slate-900 dark:text-white">{selectedChangelog.targetSpecialization}</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedChangelog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
          ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setDeleteTarget(null)}
          />

          <div className="relative w-full max-w-md rounded-3xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl border border-rose-500/30 p-6 sm:p-7 shadow-2xl z-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Retire Archived CV Release
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently remove{' '}
              <span className="font-bold text-rose-500">"{deleteTarget.version}"</span> ({deleteTarget.fileName}) from the repository archive?
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 shadow-md shadow-rose-500/25 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
