import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'portfolio_cv_registry';
const EVENT_NAME = 'portfolio_cv_updated';

export const initialCVData = {
  totalDownloads: 708,
  lastDownload: 'Today, 13:42 EAT',
  activeVersionId: 'cv-v2.1',
  releases: [
    {
      id: 'cv-v2.1',
      version: 'v2.1 (Production)',
      fileName: 'Tamrat_Gher_Resume_v2.1.pdf',
      targetSpecialization: 'Full-Stack, PostgreSQL & Android Systems',
      size: '184 KB',
      releaseDate: 'October 2026',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      downloadUrl: '#',
      isActive: true,
      changelog:
        'Added PostgreSQL schema design case studies, Android Studio projects, and updated Mekelle University leadership milestones.',
    },
    {
      id: 'cv-v2.0',
      version: 'v2.0',
      fileName: 'Tamrat_Gher_Resume_v2.0.pdf',
      targetSpecialization: 'Full-Stack Web Architecture & Node.js Services',
      size: '176 KB',
      releaseDate: 'August 2026',
      sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      downloadUrl: '#',
      isActive: false,
      changelog:
        'Expanded NexTech Innovators workshop metrics and trading journal deployment notes.',
    },
    {
      id: 'cv-v1.9',
      version: 'v1.9 (Archive)',
      fileName: 'Tamrat_Gher_Resume_v1.9.pdf',
      targetSpecialization: 'Core Systems & Database Engineering',
      size: '162 KB',
      releaseDate: 'June 2026',
      sha256: '1b85f11e62679e09cae2fe3a9d8b33e38f434346648f6b96df89dda901c5176b',
      downloadUrl: '#',
      isActive: false,
      changelog:
        'Initial verified resume version with 3.86 GPA academic standing.',
    },
  ],
};

// Generate realistic dummy SHA-256 string for user-uploaded custom releases
export const generatePseudoSHA256 = () => {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Retrieve stored CV registry data
export const getStoredCVData = () => {
  if (typeof window === 'undefined') return initialCVData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.totalDownloads === 'number' && Array.isArray(parsed.releases)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse portfolio_cv_registry from localStorage:', err);
  }

  // Seed default data if empty
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCVData));
  } catch (e) {
    // Ignore storage quota
  }
  return initialCVData;
};

// Save CV registry data and emit reactive event
export const saveStoredCVData = (data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Failed to save portfolio_cv_registry to localStorage:', err);
  }
};

// Increment download count and update timestamp
export const incrementDownloadCount = () => {
  const current = getStoredCVData();
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const updated = {
    ...current,
    totalDownloads: (current.totalDownloads || 0) + 1,
    lastDownload: `Today, ${timeStr} EAT`,
  };
  saveStoredCVData(updated);
  return updated;
};

// Set active version
export const setActiveCVVersion = (versionId) => {
  const current = getStoredCVData();
  const updatedReleases = current.releases.map((release) => ({
    ...release,
    isActive: release.id === versionId,
  }));

  const updated = {
    ...current,
    activeVersionId: versionId,
    releases: updatedReleases,
  };
  saveStoredCVData(updated);
  return updated;
};

// Create a new release
export const createNewCVRelease = (releaseData) => {
  const current = getStoredCVData();
  const id = `cv-${releaseData.version.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString(36)}`;
  
  const isSetToActive = Boolean(releaseData.isActive);

  const newRelease = {
    id,
    version: releaseData.version || 'v2.2 (Candidate)',
    fileName: releaseData.fileName || `Tamrat_Gher_Resume_${releaseData.version || 'v2.2'}.pdf`,
    targetSpecialization: releaseData.targetSpecialization || 'Full-Stack Software Architecture',
    size: releaseData.size || '190 KB',
    releaseDate: releaseData.releaseDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    sha256: releaseData.sha256 || generatePseudoSHA256(),
    downloadUrl: releaseData.downloadUrl || '#',
    isActive: isSetToActive,
    changelog: releaseData.changelog || 'Updated production candidate document with latest achievements.',
  };

  let updatedReleases = [newRelease, ...current.releases];
  if (isSetToActive) {
    updatedReleases = updatedReleases.map((r) => ({
      ...r,
      isActive: r.id === id,
    }));
  }

  const updated = {
    ...current,
    activeVersionId: isSetToActive ? id : current.activeVersionId,
    releases: updatedReleases,
  };

  saveStoredCVData(updated);
  return newRelease;
};

// Delete release (only non-active)
export const deleteCVRelease = (versionId) => {
  const current = getStoredCVData();
  if (current.activeVersionId === versionId) {
    return false; // Cannot delete active version
  }

  const updated = {
    ...current,
    releases: current.releases.filter((r) => r.id !== versionId),
  };

  saveStoredCVData(updated);
  return true;
};

// Reset to default seed
export const resetCVDataToDefault = () => {
  saveStoredCVData(initialCVData);
};

// Custom React Hook
export function useCVManager() {
  const [cvData, setCvData] = useState(getStoredCVData);

  const refresh = useCallback(() => {
    setCvData(getStoredCVData());
  }, []);

  useEffect(() => {
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const activeRelease = cvData.releases.find((r) => r.isActive) || cvData.releases[0];

  return {
    cvData,
    activeRelease,
    incrementDownloadCount,
    setActiveCVVersion,
    createNewCVRelease,
    deleteCVRelease,
    resetCVDataToDefault,
  };
}
