import { useState, useEffect, useCallback } from 'react';
import { projectsData } from '../data/projectsData';

const STORAGE_KEY = 'portfolio_projects';
const EVENT_NAME = 'portfolio_projects_updated';

// Helper to sanitize or generate slug IDs
export const generateProjectId = (title) => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  return `${slug}-${Date.now().toString(36)}`;
};

// Map category to a default preview mockup archetype
export const getCategoryPreviewType = (category) => {
  switch (category) {
    case 'Healthcare':
      return 'healthcare';
    case 'Database Solutions':
      return 'database';
    case 'FinTech':
      return 'fintech';
    case 'E-Commerce & Web':
      return 'ecommerce';
    default:
      return 'database';
  }
};

// Retrieve stored projects from localStorage or default seed data
export const getStoredProjects = () => {
  if (typeof window === 'undefined') return [...projectsData];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read portfolio_projects from localStorage:', err);
  }

  // Seed default projects if empty
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsData));
  } catch (e) {
    // Ignore storage quota errors
  }
  return [...projectsData];
};

// Save projects to localStorage and emit real-time event across tabs & components
export const saveStoredProjects = (projects) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Failed to save portfolio_projects to localStorage:', err);
  }
};

// Custom React Hook for live synced projects state
export function useProjects() {
  const [projects, setProjects] = useState(getStoredProjects);

  const refresh = useCallback(() => {
    setProjects(getStoredProjects());
  }, []);

  useEffect(() => {
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const addProject = useCallback((projectData) => {
    const current = getStoredProjects();
    const newProject = {
      id: projectData.id || generateProjectId(projectData.title || 'project'),
      title: projectData.title || 'Untitled Project',
      category: projectData.category || 'Database Solutions',
      status: projectData.status || 'Active',
      featured: Boolean(projectData.featured),
      description: projectData.description || '',
      stack: Array.isArray(projectData.stack)
        ? projectData.stack
        : typeof projectData.stack === 'string'
        ? projectData.stack
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      liveUrl: projectData.liveUrl || 'https://tamrat-gher-portfolio.vercel.app/projects',
      githubUrl: projectData.githubUrl || 'https://github.com/YG-24-cyber',
      previewType: projectData.previewType || getCategoryPreviewType(projectData.category),
      stats: projectData.stats || 'Production Architecture',
    };

    const updated = [newProject, ...current];
    saveStoredProjects(updated);
    setProjects(updated);
    return newProject;
  }, []);

  const updateProject = useCallback((id, updatedData) => {
    const current = getStoredProjects();
    const index = current.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const stack = Array.isArray(updatedData.stack)
      ? updatedData.stack
      : typeof updatedData.stack === 'string'
      ? updatedData.stack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : current[index].stack;

    const updatedProject = {
      ...current[index],
      ...updatedData,
      stack,
      previewType: updatedData.previewType || getCategoryPreviewType(updatedData.category || current[index].category),
    };

    const updated = [...current];
    updated[index] = updatedProject;

    saveStoredProjects(updated);
    setProjects(updated);
    return updatedProject;
  }, []);

  const deleteProject = useCallback((id) => {
    const current = getStoredProjects();
    const updated = current.filter((p) => p.id !== id);
    saveStoredProjects(updated);
    setProjects(updated);
  }, []);

  const toggleFeatured = useCallback((id) => {
    const current = getStoredProjects();
    const updated = current.map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    saveStoredProjects(updated);
    setProjects(updated);
  }, []);

  const resetToDefault = useCallback(() => {
    saveStoredProjects(projectsData);
    setProjects([...projectsData]);
  }, []);

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    resetToDefault,
  };
}
