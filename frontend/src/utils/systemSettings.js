import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'portfolio_system_settings';
const EVENT_NAME = 'portfolio_settings_updated';

export const DEFAULT_SETTINGS = {
  isOpenToWork: true,
  maintenanceMode: false,
  sessionTimeout: '8 Hours',
  apiEndpoint: 'http://localhost:5000/api',
};

export const getStoredSettings = () => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.isOpenToWork === 'boolean') {
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    }
  } catch (err) {
    console.error('Failed to read portfolio_system_settings from localStorage:', err);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  } catch (e) {}

  return DEFAULT_SETTINGS;
};

export const saveStoredSettings = (settings) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (err) {
    console.error('Failed to save portfolio_system_settings to localStorage:', err);
  }
};

export function useSystemSettings() {
  const [settings, setSettings] = useState(getStoredSettings);

  const refresh = useCallback(() => {
    setSettings(getStoredSettings());
  }, []);

  useEffect(() => {
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const updateSettings = useCallback((partial) => {
    const current = getStoredSettings();
    const updated = { ...current, ...partial };
    saveStoredSettings(updated);
    setSettings(updated);
    return updated;
  }, []);

  const resetSettings = useCallback(() => {
    saveStoredSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
