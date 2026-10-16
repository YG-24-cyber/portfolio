import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  ExternalLink,
  Edit3,
  Trash2,
  Star,
  CheckCircle2,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Code2,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { useProjects } from '../../utils/projectStorage';
import { GithubIcon } from '../../components/Icons';
import projectService from '../../services/projectService';

const CATEGORIES = [
  'All Domains',
  'Web Apps',
  'Mobile Apps',
  'Desktop Apps',
  'ERP Systems',
  'Other',
];

const PREVIEW_TYPES = [
  { value: 'browser_shell', label: 'Web App / Browser Shell' },
  { value: 'mobile_frame', label: 'Mobile App / Smartphone Frame' },
  { value: 'desktop_terminal', label: 'Desktop App / System Terminal' },
  { value: 'enterprise_erp', label: 'ERP System / Operations Dashboard' },
  { value: 'custom_system', label: 'Other / Architecture Diagram' },
];

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Domains');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Apps',
    status: 'Active',
    featured: false,
    description: '',
    stackInput: '',
    liveUrl: '',
    githubUrl: '',
    previewType: 'browser_shell',
    stats: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Display notification helper
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll();
      const list = Array.isArray(data?.projects) ? data.projects : Array.isArray(data) ? data : [];
      setProjects(list);
    } catch (err) {
      triggerNotification(err.message || 'Failed to load projects from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Filtered Projects Stream
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const techList = Array.isArray(project.techStack)
        ? project.techStack
        : Array.isArray(project.stack)
        ? project.stack
        : [];

      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        project.title?.toLowerCase().includes(query) ||
        project.category?.toLowerCase().includes(query) ||
        techList.some((t) => t.toLowerCase().includes(query)) ||
        project.description?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All Domains' ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      const normStatus =
        project.status?.toUpperCase() === 'PRODUCTION' ? 'Production' : 'Active';
      const matchesStatus =
        statusFilter === 'All' || normStatus === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, searchTerm, selectedCategory, statusFilter]);

  // Open modal for creation
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Healthcare',
      status: 'Active',
      featured: false,
      description: '',
      stackInput: 'React, Node.js, PostgreSQL, Tailwind CSS',
      liveUrl: 'https://tamrat-gher-portfolio.vercel.app/projects',
      githubUrl: 'https://github.com/YG-24-cyber',
      previewType: 'healthcare',
      stats: 'Production Telemetry',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    const techList = Array.isArray(project.techStack)
      ? project.techStack
      : Array.isArray(project.stack)
      ? project.stack
      : [];
    setFormData({
      title: project.title,
      category: project.category,
      status: project.status?.toUpperCase() === 'PRODUCTION' ? 'Production' : 'Active',
      featured: Boolean(project.isFeatured ?? project.featured),
      description: project.description,
      stackInput: techList.join(', '),
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      previewType: project.previewArchetype || project.previewType || 'healthcare',
      stats: project.statsMetric || project.stats || 'Production Architecture',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Project title is required.';
    if (!formData.category.trim()) errors.category = 'Category is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    if (!formData.stackInput.trim()) errors.stackInput = 'Specify at least one technology.';
    if (formData.liveUrl && !/^https?:\/\//i.test(formData.liveUrl.trim())) {
      errors.liveUrl = 'URL must start with http:// or https://';
    }
    if (formData.githubUrl && !/^https?:\/\//i.test(formData.githubUrl.trim())) {
      errors.githubUrl = 'URL must start with http:// or https://';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit modal form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const stack = formData.stackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, {
          title: formData.title.trim(),
          category: formData.category,
          status: formData.status.toUpperCase(),
          isFeatured: Boolean(formData.featured),
          description: formData.description.trim(),
          techStack: stack,
          liveUrl: formData.liveUrl.trim(),
          githubUrl: formData.githubUrl.trim(),
          previewArchetype: formData.previewType,
        });
        triggerNotification(`Project "${formData.title}" successfully updated.`);
      } else {
        await projectService.create({
          title: formData.title.trim(),
          category: formData.category,
          status: formData.status.toUpperCase(),
          isFeatured: Boolean(formData.featured),
          description: formData.description.trim(),
          techStack: stack,
          liveUrl: formData.liveUrl.trim(),
          githubUrl: formData.githubUrl.trim(),
          previewArchetype: formData.previewType,
        });
        triggerNotification(`New project "${formData.title}" successfully deployed!`);
      }
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      triggerNotification(err.message || 'Failed to save project.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm and execute delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await projectService.delete(deleteTarget.id);
      triggerNotification(`Project "${deleteTarget.title}" was removed from database.`, 'info');
      setDeleteTarget(null);
      await loadProjects();
    } catch (err) {
      triggerNotification(err.message || 'Failed to delete project.', 'error');
    }
  };

  // Toggle featured spotlight
  const handleToggleFeatured = async (project) => {
    try {
      await projectService.toggleFeatured(project.id);
      const isNowFeatured = !(project.isFeatured ?? project.featured);
      triggerNotification(
        `Project "${project.title}" ${
          isNowFeatured ? 'spotlighted on homepage' : 'removed from spotlight'
        }.`
      );
      await loadProjects();
    } catch (err) {
      triggerNotification(err.message || 'Failed to toggle spotlight.', 'error');
    }
  };

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* =========================================================================
            TOAST / STATUS NOTIFICATION BANNER
            ========================================================================= */}
        {notification && (
          <div className="fixed top-24 right-6 z-50 max-w-md animate-fadeIn">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel shadow-2xl border ${
                notification.type === 'info'
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
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>Project Repository & Inventory</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Projects{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-600 dark:from-cyan-400 dark:via-sky-300 dark:to-violet-400">
                Management Studio
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Create, update, spotlight, or remove featured multi-platform software solutions. All mutations synchronize instantaneously with public gallery views.
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-md shadow-cyan-500/25 hover:shadow-neon-cyan hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>+ Deploy New Project</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            CONTROLS & FILTER BAR
            ========================================================================= */}
        <div className="rounded-2xl glass-panel p-4 mb-6 border border-white/60 dark:border-white/10 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects by title, stack, or domain keywords..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/60 transition-colors"
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

          {/* Category Dropdown & Status Filter */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-cyan-500" />
              <span className="hidden sm:inline font-mono">Category:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/60"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/60"
            >
              <option value="All" className="bg-slate-900 text-white">All Statuses</option>
              <option value="Active" className="bg-slate-900 text-white">Active</option>
              <option value="Production" className="bg-slate-900 text-white">Production</option>
            </select>

            {/* Reset to Default Seed Data Trigger */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset project inventory back to default seed records? Any custom additions will be reverted.')) {
                  resetToDefault();
                  triggerNotification('Repository inventory reset to system defaults.', 'info');
                }
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 transition-colors"
              title="Reset inventory to system default records"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* =========================================================================
            PROJECTS INVENTORY TABLE / RESPONSIVE GLASS STREAM
            ========================================================================= */}
        <div className="rounded-2xl glass-panel border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden">
          
          {/* Table Header / Sub-Bar */}
          <div className="px-6 py-3.5 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                ACTIVE INVENTORY: {filteredProjects.length}
              </span>
              <span>of {projects.length} Total</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Click Star to Toggle Public Spotlight
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No matching projects found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                No solution records correspond to the active search or category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All Domains');
                  setStatusFilter('All');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200/60 dark:border-white/10 text-slate-400 font-mono uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/40">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">Spotlight</th>
                    <th className="py-3 px-4">Project Title & Solution Scope</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Tech Stack</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                  {filteredProjects.map((project) => {
                    const isFeatured = Boolean(project.isFeatured ?? project.featured);
                    const techList = Array.isArray(project.techStack)
                      ? project.techStack
                      : Array.isArray(project.stack)
                      ? project.stack
                      : [];
                    const statusLabel =
                      project.status?.toUpperCase() === 'PRODUCTION' ? 'Production' : 'Active';

                    return (
                      <tr
                        key={project.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors group"
                      >
                        {/* Spotlight Star Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(project)}
                            className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                              isFeatured
                                ? 'text-amber-400 bg-amber-500/10'
                                : 'text-slate-400 hover:text-amber-400'
                            }`}
                            title={isFeatured ? 'Featured on Spotlight' : 'Click to feature'}
                          >
                            <Star
                              className={`w-4 h-4 ${isFeatured ? 'fill-amber-400' : ''}`}
                            />
                          </button>
                        </td>

                        {/* Title & Description */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                            {project.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {project.description}
                          </div>
                        </td>

                        {/* Category Pill */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                            {project.category}
                          </span>
                        </td>

                        {/* Tech Stack Chips */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {techList.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono"
                              >
                                {tech}
                              </span>
                            ))}
                            {techList.length > 3 && (
                              <span className="text-[9px] text-slate-400 self-center">
                                +{techList.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                              statusLabel === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                statusLabel === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-violet-500'
                              }`}
                            />
                            <span>{statusLabel}</span>
                          </span>
                        </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live Preview */}
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10 transition-colors"
                            title="Preview Public Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Edit Project */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(project)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-500 hover:bg-sky-500/10 transition-colors"
                            title="Edit Project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Project */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(project)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Remove Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* =========================================================================
          PROJECT CREATOR / EDITOR MODAL
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Panel Container */}
          <div className="relative w-full max-w-2xl rounded-3xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl border border-white/80 dark:border-white/15 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/25">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingProject ? 'Update Software Solution' : 'Deploy New Project'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingProject
                      ? `Editing record: ${editingProject.id}`
                      : 'Register a new engineering project into the public portfolio gallery.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Distributed Cash Flow Engine"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  {formErrors.title && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Domain Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Domains').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Status & Preview Mockup Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Deployment Status
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={formData.status === 'Active'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="text-cyan-500 focus:ring-0"
                      />
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Production"
                        checked={formData.status === 'Production'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="text-violet-500 focus:ring-0"
                      />
                      <span className="font-semibold text-violet-600 dark:text-violet-400">
                        Production
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preview Archetype (Visual Mockup)
                  </label>
                  <select
                    value={formData.previewType}
                    onChange={(e) => setFormData({ ...formData, previewType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono text-[11px]"
                  >
                    {PREVIEW_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Problem-Solution Overview <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the architecture, database scaling capabilities, and technical value delivered..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed"
                />
                {formErrors.description && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Tech Stack Comma-Separated */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tech Stack (Comma-separated) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.stackInput}
                  onChange={(e) => setFormData({ ...formData, stackInput: e.target.value })}
                  placeholder="React, TypeScript, Node.js, PostgreSQL, Tailwind CSS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
                {formErrors.stackInput && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.stackInput}</p>
                )}

                {/* Live chips preview */}
                {formData.stackInput && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.stackInput
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] border border-cyan-500/20"
                        >
                          {t}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Row 3: URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  {formErrors.liveUrl && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.liveUrl}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub Source Repository
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  {formErrors.githubUrl && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.githubUrl}</p>
                  )}
                </div>
              </div>

              {/* Row 4: Stats Tag & Featured Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Architecture Metric / Telemetry Tag
                  </label>
                  <input
                    type="text"
                    value={formData.stats}
                    onChange={(e) => setFormData({ ...formData, stats: e.target.value })}
                    placeholder="e.g. 1,200+ Patient Records"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded text-cyan-500 focus:ring-0 w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Spotlight on Homepage
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Feature this project in top showcases.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-md shadow-cyan-500/25 hover:shadow-neon-cyan transition-all duration-200"
                >
                  {editingProject ? 'Save Changes' : 'Deploy Project'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          DELETE CONFIRMATION MODAL
          ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setDeleteTarget(null)}
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-md rounded-3xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl border border-rose-500/30 p-6 sm:p-7 shadow-2xl z-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Confirm Project Removal
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete{' '}
              <span className="font-bold text-rose-500">"{deleteTarget.title}"</span> from the portfolio repository? This action cannot be reversed.
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
