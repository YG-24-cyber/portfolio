import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Settings,
  Shield,
  Lock,
  Key,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Server,
  Database,
  Cpu,
  Radio,
  LogOut,
  X,
  Trash2,
  Layers,
  Globe,
  Bell,
  SlidersHorizontal,
  Briefcase,
  AlertOctagon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSystemSettings } from '../../utils/systemSettings';
import { saveStoredProjects, getStoredProjects } from '../../utils/projectStorage';
import { projectsData } from '../../data/projectsData';
import { saveStoredBlogs, getStoredBlogs } from '../../utils/blogStorage';
import { blogPosts } from '../../data/blogData';
import { saveStoredCVData, initialCVData } from '../../utils/cvStorage';

export default function AdminSettings() {
  const { adminUser, updateCredentials, revokeAllSessions } = useAuth();
  const { settings, updateSettings, resetSettings } = useSystemSettings();
  const navigate = useNavigate();

  // Toast feedback state
  const [notification, setNotification] = useState(null);
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Credential Form State
  const [displayName, setDisplayName] = useState(adminUser?.displayName || 'Tamrat G/her');
  const [email, setEmail] = useState(adminUser?.email || 'admin@tamrat.dev');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [credErrors, setCredErrors] = useState({});
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  // System Settings State
  const [isOpenToWork, setIsOpenToWork] = useState(settings.isOpenToWork);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [sessionTimeout, setSessionTimeout] = useState(settings.sessionTimeout || '8 Hours');
  const [apiEndpoint, setApiEndpoint] = useState(settings.apiEndpoint || 'http://localhost:5000/api');

  // Danger Zone Modals
  const [purgeModalOpen, setPurgeModalOpen] = useState(false);
  const [purgeInputText, setPurgeInputText] = useState('');
  const [resetDefaultsModalOpen, setResetDefaultsModalOpen] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: 'None', color: 'bg-slate-300 dark:bg-slate-700' };
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Strong', color: 'bg-cyan-500' };
      case 4:
        return { score: 4, label: 'Maximum', color: 'bg-emerald-500' };
      default:
        return { score: 0, label: 'None', color: 'bg-slate-700' };
    }
  }, [newPassword]);

  // Handle Credential Form Submission
  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!currentPassword) {
      errors.currentPassword = 'You must enter your current password to authorize changes.';
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        errors.newPassword = 'New password must be at least 6 characters.';
      }
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'New passwords do not match.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setCredErrors(errors);
      return;
    }

    setCredErrors({});
    setIsUpdatingCreds(true);

    try {
      const res = await updateCredentials({
        displayName,
        email,
        currentPassword,
        newPassword: newPassword || undefined,
      });

      if (res.success) {
        triggerNotification(res.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setCredErrors({ currentPassword: res.message });
      }
    } catch (err) {
      setCredErrors({ currentPassword: err.message || 'An error occurred while updating credentials.' });
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  // Handle System Preferences Submission
  const handleSavePreferences = (e) => {
    e.preventDefault();
    updateSettings({
      isOpenToWork,
      maintenanceMode,
      sessionTimeout,
      apiEndpoint,
    });
    triggerNotification('System preferences and public status synchronized successfully.');
  };

  // Danger Zone: Clear Session Cache
  const handleClearSessionCache = () => {
    localStorage.removeItem('admin_user');
    triggerNotification('Session token cache refreshed.', 'info');
  };

  // Danger Zone: Reset All Seed Defaults
  const handleConfirmResetDefaults = () => {
    saveStoredProjects(projectsData);
    saveStoredBlogs(blogPosts);
    saveStoredCVData(initialCVData);
    resetSettings();
    setResetDefaultsModalOpen(false);
    triggerNotification('All projects, essays, CV documents, and settings reset to system seeds.', 'info');
  };

  // Danger Zone: Purge All LocalStorage
  const handleExecutePurge = () => {
    if (purgeInputText.trim() !== 'PURGE') return;
    localStorage.clear();
    setPurgeModalOpen(false);
    revokeAllSessions();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* =========================================================================
            TOAST ALERT BANNER
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400 mb-3 shadow-sm shadow-cyan-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <Settings className="w-3.5 h-3.5 text-cyan-500" />
              <span>System Preferences & Security</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Console{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-600 dark:from-cyan-400 dark:via-sky-300 dark:to-violet-400">
                Configuration Studio
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Manage administrator credentials, security policies, public availability states, and environment parameters.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            2-COLUMN RESPONSIVE SUITE (7 Cols Left / 5 Cols Right)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* =======================================================================
              LEFT COLUMN (7 COLS): Security & Master Credentials
              ======================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-xl">
              
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/60 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Administrative Identity & Master Credentials
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Update console credentials and manage authentication keys.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ACTIVE SESSION
                </span>
              </div>

              <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs">
                
                {/* Display Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Administrator Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Current Password Verification */}
                <div className="pt-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Master Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter existing password to verify authority..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {credErrors.currentPassword && (
                    <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{credErrors.currentPassword}</span>
                    </p>
                  )}
                </div>

                {/* New Password & Confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank to keep unchanged"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {credErrors.newPassword && (
                      <p className="text-rose-500 text-[11px] mt-1">{credErrors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    />
                    {credErrors.confirmPassword && (
                      <p className="text-rose-500 text-[11px] mt-1">{credErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Password Strength Meter */}
                {newPassword && (
                  <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600 dark:text-slate-400">Cryptographic Entropy:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {passwordStrength.label} ({passwordStrength.score}/4)
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-all duration-300 ${
                            passwordStrength.score >= step
                              ? passwordStrength.color
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Session Security Selector */}
                <div className="pt-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Session Security & Auto-Lock Horizon
                  </label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="1 Hour">1 Hour (Strict Protocol)</option>
                    <option value="8 Hours">8 Hours (Standard Operational Day)</option>
                    <option value="24 Hours">24 Hours (Extended Session)</option>
                    <option value="Persistent">Persistent (Developer Workspace Mode)</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="pt-5 border-t border-slate-200/60 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isUpdatingCreds}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-md shadow-cyan-500/25 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isUpdatingCreds ? 'Validating...' : 'Save Credential Updates'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Revoke all active sessions and log out immediately?')) {
                        revokeAllSessions();
                        navigate('/admin/login', { replace: true });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Revoke All Active Sessions</span>
                  </button>
                </div>

              </form>

            </div>
          </div>

          {/* =======================================================================
              RIGHT COLUMN (5 COLS): System Preferences & Diagnostics
              ======================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* System Preferences Card */}
            <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl">
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-200/60 dark:border-white/10">
                <SlidersHorizontal className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Public Signals & Preferences
                </h3>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
                
                {/* Open to Work Toggle */}
                <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Open for Contracts / Hiring</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Controls the live availability indicator across public pages.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={isOpenToWork}
                      onChange={(e) => setIsOpenToWork(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>

                {/* Maintenance Mode Simulation Toggle */}
                <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
                      <span>Maintenance Mode Simulation</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Simulates backend telemetry maintenance status.
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                </div>

                {/* API Gateway Endpoint */}
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    API Gateway Endpoint (Backend Stage)
                  </label>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-colors font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/20 transition-all"
                  >
                    Save System Preferences
                  </button>
                </div>

              </form>
            </div>

            {/* Environment Diagnostics Card */}
            <div className="rounded-3xl glass-panel p-6 sm:p-7 border border-white/60 dark:border-white/10 shadow-xl">
              <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-200/60 dark:border-white/10">
                <Server className="w-4 h-4 text-cyan-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Environment Telemetry & Stack
                </h3>
              </div>

              <div className="space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Database Engine:</span>
                  <span className="font-bold text-cyan-500">PostgreSQL 16 via Prisma ORM</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Frontend Runtime:</span>
                  <span className="font-bold text-violet-500">React 18 + Vite (ESM)</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Security Protocol:</span>
                  <span className="font-bold text-emerald-500">256-Bit Encrypted JWT</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Admin Role:</span>
                  <span className="font-bold text-emerald-500">SUPER_ADMIN</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            FULL-WIDTH "DANGER ZONE" PANEL
            ========================================================================= */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-rose-500/30 bg-rose-950/[0.04] dark:bg-rose-950/10 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-rose-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">
                  Danger Zone & System Maintenance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Irreversible administrative operations, seed restoration, and local database cache purging.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
              HIGH IMPACT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Action 1: Clear Session Cache */}
            <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                  Flush Session Cache
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Cleanses client token caches while preserving projects and published essays.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearSessionCache}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-colors"
              >
                Clear Token Cache
              </button>
            </div>

            {/* Action 2: Reset to Seed Defaults */}
            <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                  Restore Seed Defaults
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Re-populates all projects, blog articles, and CV versions back to pristine factory records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setResetDefaultsModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
              >
                Reset All Repositories
              </button>
            </div>

            {/* Action 3: Purge All LocalStorage */}
            <div className="p-4 rounded-2xl bg-rose-500/[0.05] border border-rose-500/20 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-rose-600 dark:text-rose-400 text-xs mb-1">
                  Purge All Local Storage
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Complete wipe of all local databases, custom passwords, and session tokens.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPurgeInputText('');
                  setPurgeModalOpen(true);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-500/25 transition-all"
              >
                Purge Storage State
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          RESET DEFAULTS CONFIRMATION MODAL
          ========================================================================= */}
      {resetDefaultsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setResetDefaultsModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl border border-amber-500/30 p-6 sm:p-7 shadow-2xl z-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Restore System Seed Defaults?
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              This will reset the projects inventory, technical essays, CV repository, and system preferences back to their factory records. Any custom items will be overwritten.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setResetDefaultsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetDefaults}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-md shadow-amber-500/25 transition-all"
              >
                Confirm Factory Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          HIGH-FRICTION PURGE MODAL (Type "PURGE")
          ========================================================================= */}
      {purgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setPurgeModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl border border-rose-500/40 p-6 sm:p-7 shadow-2xl z-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Emergency System Purge
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              This destructive action will completely wipe all localStorage data (projects, blogs, CVs, preferences, and custom credentials) and log you out immediately.
            </p>

            <p className="text-xs font-bold text-rose-500 mb-2">
              Type "PURGE" below to confirm:
            </p>

            <input
              type="text"
              value={purgeInputText}
              onChange={(e) => setPurgeInputText(e.target.value)}
              placeholder="Type PURGE"
              className="w-full text-center px-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-rose-500/40 text-slate-900 dark:text-white font-mono font-bold tracking-widest focus:outline-none focus:border-rose-500 mb-6"
            />

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPurgeModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={purgeInputText.trim() !== 'PURGE'}
                onClick={handleExecutePurge}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all ${
                  purgeInputText.trim() === 'PURGE'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-500/25 cursor-pointer'
                    : 'bg-slate-400 dark:bg-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                Purge & Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
