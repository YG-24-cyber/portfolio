import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  X,
  Tag,
  CheckCircle2,
  Share2,
  Bookmark,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { blogCategories } from '../data/blogData';
import blogService from '../services/blogService';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Fetch blogs from live PostgreSQL backend
  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await blogService.getAll();
        const blogList = Array.isArray(data?.blogs) ? data.blogs : Array.isArray(data) ? data : [];
        if (isMounted) {
          setBlogs(blogList);
        }
      } catch (err) {
        console.error('Failed to load blog posts from backend API:', err);
        if (isMounted) {
          setError(err.message || 'Unable to connect to blog service.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return blogs.filter((post) => {
      const matchesCategory =
        activeCategory === 'All Posts' ||
        post.category?.toLowerCase() === activeCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const tagsList = Array.isArray(post.tags) ? post.tags : [];

      const matchesSearch =
        query === '' ||
        post.title?.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        tagsList.some((tag) => tag.toLowerCase().includes(query)) ||
        post.category?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  // Determine if the featured post should be shown in the hero slot
  const featuredPost = filteredPosts.find((p) => p.isFeatured || p.featured);
  // Grid posts: if featured post is shown in hero slot, exclude it from grid when in "All Posts" view
  const gridPosts =
    featuredPost && activeCategory === 'All Posts' && searchQuery === ''
      ? filteredPosts.filter((p) => p.id !== featuredPost.id)
      : filteredPosts;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="relative pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* =========================================================================
            HEADER SECTION
            ========================================================================= */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          {/* Frosted Capsule Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold tracking-wider uppercase text-cyan-600 dark:text-cyan-400 mb-4 shadow-sm shadow-cyan-500/10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Technical Insights & Essays</span>
          </div>

          {/* Gradient Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
            Engineering Notes &{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-600 dark:from-cyan-400 dark:via-sky-300 dark:to-violet-400">
              Case Studies
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
            Practical insights on PostgreSQL architecture, full-stack scalability, and multi-platform computing systems written from hands-on software development.
          </p>
        </div>

        {/* =========================================================================
            CONTROLS BAR: Real-time Search + Category Filter Pills
            ========================================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Real-time Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, tags, SQL..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm glass-panel text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-white/60 dark:border-white/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills (Floating Pill Track) */}
          <div className="rounded-2xl glass-panel p-1.5 border border-white/60 dark:border-white/10 shadow-lg flex items-center gap-1.5 overflow-x-auto max-w-full">
            {blogCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-cyan-500/25 ring-1 ring-white/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            FEATURED HERO SPOTLIGHT (Shown when viewing "All Posts" with no search)
            ========================================================================= */}
        {!loading && featuredPost && activeCategory === 'All Posts' && searchQuery === '' && (
          <div className="mb-14">
            <div className="relative rounded-3xl glass-card card-shine p-6 sm:p-10 border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden group hover:border-cyan-500/40 transition-all duration-300">
              {/* Background ambient lighting */}
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                {/* Spotlight Header Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-violet-600 shadow-md shadow-cyan-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured Architecture Essay
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    {featuredPost.category}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime || '5 min read'}
                  </span>
                </div>

                {/* Hero Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  {featuredPost.title}
                </h2>

                {/* Excerpt */}
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6">
                  {featuredPost.excerpt}
                </p>

                {/* Meta & Trigger CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/60 dark:border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {(featuredPost.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(featuredPost)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200"
                  >
                    <span>Read Deep Dive</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            ARTICLES GRID
            ========================================================================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-2xl glass-panel p-6 border border-white/60 dark:border-white/10 animate-pulse space-y-4"
              >
                <div className="h-4 w-28 bg-slate-300/40 dark:bg-slate-700/40 rounded-full" />
                <div className="h-6 w-3/4 bg-slate-300/40 dark:bg-slate-700/40 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-slate-300/30 dark:bg-slate-800/50 rounded" />
                  <div className="h-3 w-5/6 bg-slate-300/30 dark:bg-slate-800/50 rounded" />
                </div>
                <div className="h-4 w-1/2 bg-slate-300/30 dark:bg-slate-800/40 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl glass-panel p-10 text-center border border-rose-500/20 max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
              Unable to Retrieve Technical Notes
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
        ) : gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.id}
                className="group relative rounded-2xl glass-card card-shine p-6 flex flex-col justify-between border border-white/60 dark:border-white/10 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 dark:hover:border-cyan-500/30"
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400">
                      {post.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime || '4 min read'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2.5 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1 max-w-[70%]">
                    {(post.tags || []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(post)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 group-hover:translate-x-1 transition-all"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl glass-panel p-12 text-center border border-white/60 dark:border-white/10 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-60" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No articles match your search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Try adjusting your query or selecting a different category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All Posts');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 shadow-md shadow-cyan-500/20"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* =========================================================================
            READING MODAL (Full Story View with Glassmorphism)
            ========================================================================= */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 border border-white/60 dark:border-white/10 shadow-2xl p-6 sm:p-8 overflow-y-auto">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Metadata */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {formatDate(selectedArticle.publishedAt || selectedArticle.date)} ({selectedArticle.readTime || '5 min read'})
                </span>
              </div>

              {/* Modal Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                {selectedArticle.title}
              </h2>

              {/* Author Badge */}
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-200/60 dark:border-white/10">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-cyan-500/20">
                  TG
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tamrat G/her
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Applied Computing & Full-Stack Systems
                  </div>
                </div>
              </div>

              {/* Article Body Content */}
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {selectedArticle.body || selectedArticle.content}
              </div>

              {/* Tags in Modal */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10">
                {(selectedArticle.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Close Bottom CTA */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 glass-panel hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10"
                >
                  Done Reading
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
