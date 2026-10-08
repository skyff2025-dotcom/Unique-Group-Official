import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ContactInfo } from '../types';
import { BUSINESS_CONTACT } from '../data/mockData';
import { getSiteSettings } from '../services/settings';

export type SiteSettingsContextValue = ContactInfo & {
  refreshSettings: () => Promise<void>;
};

const defaultContextValue: SiteSettingsContextValue = {
  ...BUSINESS_CONTACT,
  refreshSettings: async () => {},
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>(defaultContextValue);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ContactInfo>(BUSINESS_CONTACT);

  const loadSettings = useCallback(async (force = false) => {
    try {
      const data = await getSiteSettings(force);
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.warn('SiteSettings load fallback:', err);
    }
  }, []);

  useEffect(() => {
    loadSettings();

    const handleUpdate = () => {
      loadSettings(true);
    };

    window.addEventListener('site_settings_updated', handleUpdate);
    return () => {
      window.removeEventListener('site_settings_updated', handleUpdate);
    };
  }, [loadSettings]);

  const value: SiteSettingsContextValue = {
    ...settings,
    refreshSettings: async () => {
      await loadSettings(true);
    },
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
