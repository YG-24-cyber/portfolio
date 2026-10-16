import { useState, useEffect, useCallback } from 'react';
import { blogPosts } from '../data/blogData';

const STORAGE_KEY = 'portfolio_blogs';
const EVENT_NAME = 'portfolio_blogs_updated';

// Helper to sanitize or generate slug identifiers
export const generateBlogSlug = (title) => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  return slug || `article-${Date.now().toString(36)}`;
};

// Estimate read time based on word count
export const estimateReadTime = (content) => {
  if (!content) return '4 min read';
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min read`;
};

// Format current date e.g. "October 2026"
export const getFormattedDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Retrieve stored blogs from localStorage or seed data
export const getStoredBlogs = () => {
  if (typeof window === 'undefined') return [...blogPosts];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read portfolio_blogs from localStorage:', err);
  }

  // Seed default posts if empty
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogPosts));
  } catch (e) {
    // Ignore storage quota errors
  }
  return [...blogPosts];
};

// Save blogs to localStorage and emit real-time event across tabs & components
export const saveStoredBlogs = (blogs) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Failed to save portfolio_blogs to localStorage:', err);
  }
};

// Custom React Hook for live synced blogs state
export function useBlogs() {
  const [blogs, setBlogs] = useState(getStoredBlogs);

  const refresh = useCallback(() => {
    setBlogs(getStoredBlogs());
  }, []);

  useEffect(() => {
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const createBlog = useCallback((blogData) => {
    const current = getStoredBlogs();
    const title = blogData.title?.trim() || 'Untitled Technical Essay';
    const slug = blogData.slug?.trim() ? generateBlogSlug(blogData.slug) : generateBlogSlug(title);

    const tags = Array.isArray(blogData.tags)
      ? blogData.tags
      : typeof blogData.tags === 'string'
      ? blogData.tags
          .split(',')
          .map((t) => t.trim().replace(/^#/, ''))
          .filter(Boolean)
      : ['System Design'];

    const content = blogData.content?.trim() || 'Article content in review.';
    const readTime = blogData.readTime?.trim() || estimateReadTime(content);
    const date = blogData.date?.trim() || getFormattedDate();

    // If marked featured, remove featured flag from other posts
    let updatedCurrent = current;
    if (blogData.featured) {
      updatedCurrent = current.map((b) => ({ ...b, featured: false }));
    }

    const newBlog = {
      id: Date.now(),
      slug,
      title,
      category: blogData.category || 'System Design',
      readTime,
      date,
      excerpt: blogData.excerpt?.trim() || content.slice(0, 160) + '...',
      tags,
      featured: Boolean(blogData.featured),
      content,
    };

    const updated = [newBlog, ...updatedCurrent];
    saveStoredBlogs(updated);
    setBlogs(updated);
    return newBlog;
  }, []);

  const updateBlog = useCallback((idOrSlug, updatedData) => {
    const current = getStoredBlogs();
    const index = current.findIndex(
      (b) => String(b.id) === String(idOrSlug) || b.slug === idOrSlug
    );
    if (index === -1) return null;

    const tags = Array.isArray(updatedData.tags)
      ? updatedData.tags
      : typeof updatedData.tags === 'string'
      ? updatedData.tags
          .split(',')
          .map((t) => t.trim().replace(/^#/, ''))
          .filter(Boolean)
      : current[index].tags;

    const content = updatedData.content !== undefined ? updatedData.content.trim() : current[index].content;
    const readTime = updatedData.readTime?.trim() || estimateReadTime(content);

    let updatedList = [...current];

    // If this update sets featured to true, clear it from all other articles
    if (updatedData.featured) {
      updatedList = updatedList.map((b, i) => (i === index ? b : { ...b, featured: false }));
    }

    const updatedBlog = {
      ...updatedList[index],
      ...updatedData,
      tags,
      content,
      readTime,
      slug: updatedData.slug?.trim()
        ? generateBlogSlug(updatedData.slug)
        : updatedList[index].slug,
    };

    updatedList[index] = updatedBlog;
    saveStoredBlogs(updatedList);
    setBlogs(updatedList);
    return updatedBlog;
  }, []);

  const deleteBlog = useCallback((idOrSlug) => {
    const current = getStoredBlogs();
    const updated = current.filter(
      (b) => String(b.id) !== String(idOrSlug) && b.slug !== idOrSlug
    );
    saveStoredBlogs(updated);
    setBlogs(updated);
  }, []);

  const toggleFeaturedBlog = useCallback((idOrSlug) => {
    const current = getStoredBlogs();
    const target = current.find(
      (b) => String(b.id) === String(idOrSlug) || b.slug === idOrSlug
    );
    if (!target) return;

    // Toggle: if turning on, make all others false. If turning off, just turn off.
    const willBeFeatured = !target.featured;
    const updated = current.map((b) => {
      if (String(b.id) === String(idOrSlug) || b.slug === idOrSlug) {
        return { ...b, featured: willBeFeatured };
      }
      return willBeFeatured ? { ...b, featured: false } : b;
    });

    saveStoredBlogs(updated);
    setBlogs(updated);
  }, []);

  const resetBlogsToDefault = useCallback(() => {
    saveStoredBlogs(blogPosts);
    setBlogs([...blogPosts]);
  }, []);

  return {
    blogs,
    createBlog,
    updateBlog,
    deleteBlog,
    toggleFeaturedBlog,
    resetBlogsToDefault,
  };
}
