import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
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
  Clock,
  Calendar,
  Tag,
  BookOpen,
  Eye,
} from 'lucide-react';
import { generateBlogSlug, estimateReadTime, getFormattedDate } from '../../utils/blogStorage';
import blogService from '../../services/blogService';

const CATEGORIES = [
  'All Categories',
  'Web Apps',
  'Mobile Apps',
  'Desktop Apps',
  'ERP Systems',
  'Other',
];

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [previewArticle, setPreviewArticle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Web Apps',
    readTime: '5 min read',
    date: getFormattedDate(),
    excerpt: '',
    tagsInput: 'PostgreSQL, Database Architecture, SQL',
    content: '',
    featured: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Display notification helper
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAll();
      const list = Array.isArray(data?.blogs) ? data.blogs : Array.isArray(data) ? data : [];
      setBlogs(list);
    } catch (err) {
      triggerNotification(err.message || 'Failed to load articles from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Filtered Blogs Stream
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const query = searchTerm.toLowerCase().trim();
      const tagsList = Array.isArray(blog.tags) ? blog.tags : [];
      const matchesSearch =
        query === '' ||
        blog.title?.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query) ||
        tagsList.some((tag) => tag.toLowerCase().includes(query)) ||
        blog.category?.toLowerCase().includes(query) ||
        blog.slug?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All Categories' ||
        blog.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  // Open modal for new article
  const handleOpenCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      category: 'PostgreSQL & SQL',
      readTime: '5 min read',
      date: getFormattedDate(),
      excerpt: '',
      tagsInput: 'PostgreSQL, Prisma ORM, SQL',
      content: '',
      featured: false,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      readTime: blog.readTime || '5 min read',
      date: blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : getFormattedDate(),
      excerpt: blog.excerpt,
      tagsInput: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      content: blog.body || blog.content || '',
      featured: Boolean(blog.isFeatured ?? blog.featured),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Auto-generate slug when title changes (if user hasn't explicitly customized slug)
  const handleTitleChange = (val) => {
    const nextSlug = editingBlog && formData.slug !== generateBlogSlug(formData.title)
      ? formData.slug
      : generateBlogSlug(val);

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: nextSlug,
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Article title is required.';
    if (!formData.slug.trim()) errors.slug = 'URL slug is required.';
    if (!formData.category.trim()) errors.category = 'Category is required.';
    if (!formData.excerpt.trim()) errors.excerpt = 'Short excerpt summary is required.';
    if (!formData.content.trim()) errors.content = 'Full article body content is required.';
    if (!formData.tagsInput.trim()) errors.tagsInput = 'Specify at least one technical topic tag.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit modal form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const tags = formData.tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const calculatedReadTime = formData.readTime.trim() || estimateReadTime(formData.content);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category,
      readTime: calculatedReadTime,
      excerpt: formData.excerpt.trim(),
      tags,
      body: formData.content.trim(),
      isFeatured: Boolean(formData.featured),
    };

    setIsSubmitting(true);
    try {
      if (editingBlog) {
        await blogService.update(editingBlog.id, payload);
        triggerNotification(`Article "${formData.title}" updated successfully.`);
      } else {
        await blogService.create(payload);
        triggerNotification(`Article "${formData.title}" published successfully!`);
      }
      setIsModalOpen(false);
      await loadBlogs();
    } catch (err) {
      triggerNotification(err.message || 'Failed to save article.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm and execute delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await blogService.delete(deleteTarget.id);
      triggerNotification(`Article "${deleteTarget.title}" was removed from publication registry.`, 'info');
      setDeleteTarget(null);
      await loadBlogs();
    } catch (err) {
      triggerNotification(err.message || 'Failed to remove article.', 'error');
    }
  };

  // Toggle featured hero spotlight
  const handleToggleFeaturedBlog = async (blog) => {
    try {
      await blogService.toggleFeatured(blog.id);
      const isNowFeatured = !(blog.isFeatured ?? blog.featured);
      triggerNotification(
        `Article "${blog.title}" ${
          isNowFeatured ? 'promoted to hero spotlight' : 'demoted from hero spotlight'
        }.`
      );
      await loadBlogs();
    } catch (err) {
      triggerNotification(err.message || 'Failed to toggle spotlight.', 'error');
    }
  };

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* =========================================================================
            NOTIFICATION ALERT
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold tracking-wider uppercase text-violet-600 dark:text-violet-400 mb-3 shadow-sm shadow-violet-500/10">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <FileText className="w-3.5 h-3.5 text-violet-500" />
              <span>Publication & Editorial Desk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Technical Blog{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 dark:from-violet-400 dark:via-sky-300 dark:to-cyan-400">
                Management Studio
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Author, edit, spotlight, or retire engineering essays and architectural case studies. Synchronized live with public readers.
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-md shadow-violet-500/25 hover:shadow-neon-violet hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>+ Write New Article</span>
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
              placeholder="Search essays by title, excerpt, tags, or slug..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/60 transition-colors"
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

          {/* Category Dropdown & Reset */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5 text-violet-500" />
              <span className="hidden sm:inline font-mono">Category:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500/60"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>

            {/* Refresh Articles from Database */}
            <button
              type="button"
              onClick={loadBlogs}
              className="p-2 rounded-xl text-slate-500 hover:text-violet-500 dark:hover:text-violet-400 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-white/10 transition-colors"
              title="Refresh articles from database"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* =========================================================================
            ARTICLES INVENTORY TABLE
            ========================================================================= */}
        <div className="rounded-2xl glass-panel border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden">
          
          {/* Sub-bar */}
          <div className="px-6 py-3.5 border-b border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="font-bold text-violet-600 dark:text-violet-400">
                ACTIVE ESSAYS: {filteredBlogs.length}
              </span>
              <span>of {blogs.length} Total Registered</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Star indicates Primary Spotlight Story
            </div>
          </div>

          {filteredBlogs.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                No matching articles found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                No technical essays correspond to the active search or category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All Categories');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-violet-600 dark:text-violet-400 border border-violet-500/30 hover:bg-violet-500/10 transition-colors"
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
                    <th className="py-3 px-4 w-12 text-center">Hero</th>
                    <th className="py-3 px-4">Article Title & Overview</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Topics / Tags</th>
                    <th className="py-3 px-4">Read Time</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                  {filteredBlogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors group"
                    >
                      {/* Spotlight Star Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeaturedBlog(blog)}
                          className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                            blog.isFeatured ?? blog.featured
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-slate-400 hover:text-amber-400'
                          }`}
                          title={(blog.isFeatured ?? blog.featured) ? 'Primary Featured Story' : 'Click to set as primary featured story'}
                        >
                          <Star
                            className={`w-4 h-4 ${(blog.isFeatured ?? blog.featured) ? 'fill-amber-400' : ''}`}
                          />
                        </button>
                      </td>

                      {/* Title & Metadata */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                          {blog.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {blog.excerpt}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                          <span className="text-violet-500 dark:text-violet-400">/{blog.slug}</span>
                          <span>•</span>
                          <span>{blog.date}</span>
                        </div>
                      </td>

                      {/* Category Pill */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-mono font-semibold text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20">
                          {blog.category}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span className="text-[9px] text-slate-400 self-center">
                              +{blog.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Read Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-violet-500" />
                          <span>{blog.readTime}</span>
                        </div>
                      </td>

                      {/* Action Controls */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Reading Preview Modal */}
                          <button
                            type="button"
                            onClick={() => setPreviewArticle(blog)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10 transition-colors"
                            title="Preview Reading View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Article */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(blog)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-violet-500 hover:bg-violet-500/10 transition-colors"
                            title="Edit Article"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Article */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(blog)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Remove Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* =========================================================================
          ARTICLE AUTHORING & EDITING MODAL
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Panel Container */}
          <div className="relative w-full max-w-3xl rounded-3xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl border border-white/80 dark:border-white/15 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/25">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingBlog ? 'Update Technical Essay' : 'Author New Technical Essay'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingBlog
                      ? `Editing publication record ID: ${editingBlog.id}`
                      : 'Compose a technical deep dive to be published on the portfolio engineering desk.'}
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
              
              {/* Row 1: Title */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title / Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Architecting Distributed Key-Value Caching for Fast Query Retries"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
                {formErrors.title && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.title}</p>
                )}
              </div>

              {/* Row 2: Slug & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    URL Slug Identifier <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="architecting-distributed-caching"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-colors font-mono text-[11px]"
                  />
                  {formErrors.slug && (
                    <p className="text-rose-500 text-[11px] mt-1">{formErrors.slug}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Domain Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Read Time & Publication Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Reading Time
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="6 min read"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Publication Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="October 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Teaser Excerpt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A concise summary highlighting the problem, architecture, or outcome for reader cards..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-colors leading-relaxed"
                />
                {formErrors.excerpt && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.excerpt}</p>
                )}
              </div>

              {/* Tags Comma-separated */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topics / Tags (Comma-separated) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tagsInput}
                  onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                  placeholder="PostgreSQL, Redis, System Design, ACID"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
                {formErrors.tagsInput && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.tagsInput}</p>
                )}

                {/* Live chips preview */}
                {formData.tagsInput && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.tagsInput
                      .split(',')
                      .map((t) => t.trim().replace(/^#/, ''))
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono text-[10px] border border-violet-500/20"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Full Article Body */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Article Body (Markdown / Text) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full technical essay breakdown, architectural sections, and code examples..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 transition-colors font-mono text-xs leading-relaxed"
                />
                {formErrors.content && (
                  <p className="text-rose-500 text-[11px] mt-1">{formErrors.content}</p>
                )}
              </div>

              {/* Featured Switch */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-violet-600 focus:ring-0 w-4 h-4"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Primary Spotlight Featured Story</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Showcase as the full-width spotlight banner at the top of the public /blog hub.
                    </div>
                  </div>
                </label>
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
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-md shadow-violet-500/25 hover:shadow-neon-violet transition-all duration-200"
                >
                  {editingBlog ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          READING VIEW PREVIEW MODAL
          ========================================================================= */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 border border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-8 overflow-y-auto">
            
            <button
              type="button"
              onClick={() => setPreviewArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                {previewArticle.category}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {previewArticle.date} ({previewArticle.readTime})
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {previewArticle.title}
            </h2>

            <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-200/60 dark:border-white/10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/20">
                TG
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tamrat G/her
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Author & Engineering Lead
                </div>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-sans">
              {previewArticle.content}
            </div>

            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10">
              {previewArticle.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10"
              >
                Close Preview
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
              Confirm Article Removal
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Are you sure you want to permanently delete{' '}
              <span className="font-bold text-rose-500">"{deleteTarget.title}"</span>? This action will permanently remove it from the publication registry.
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
