import { create } from 'zustand';
import { AppSettings, ShortcutSettings, FolderSettings, GeneralSettings } from '../../shared/types';

// Default settings
const defaultShortcuts: ShortcutSettings = {
  startRecording: 'Cmd+Shift+R',
  stopRecording: 'Cmd+Shift+S',
  pauseRecording: 'Cmd+Shift+P',
  resumeRecording: 'Cmd+Shift+P',
  takeScreenshot: 'Cmd+Shift+4',
  openSettings: 'Cmd+,',
  newProject: 'Cmd+N',
  saveProject: 'Cmd+S',
  exportVideo: 'Cmd+E',
  toggleFullscreen: 'Cmd+Ctrl+F',
};

const defaultFolders: FolderSettings = {
  recordings: '~/Documents/KwikShot/Recordings',
  projects: '~/Documents/KwikShot/Projects',
  tracks: '~/Documents/KwikShot/Tracks',
  exports: '~/Documents/KwikShot/Exports',
  screenshots: '~/Documents/KwikShot/Screenshots',
  createFoldersAutomatically: true,
  openFolderAfterSaving: false,
  organizeByDate: true,
};

const defaultGeneral: GeneralSettings = {
  autoSave: true,
  autoSaveInterval: 5,
  showNotifications: true,
  minimizeToTray: false,
  startMinimized: false,
  checkForUpdates: true,
  language: 'en',
  defaultFormat: 'mp4',
};

const defaultSettings: AppSettings = {
  theme: 'dark',
  shortcuts: defaultShortcuts,
  recording: {
    resolution: '1080p',
    frameRate: 30,
    quality: 'high',
    format: 'mp4',
    outputDirectory: defaultFolders.recordings,
  },
  editor: {
    autoSave: true,
    autoSaveInterval: 5,
    previewQuality: 'medium',
  },
  folders: defaultFolders,
  general: defaultGeneral,
};

export interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  
  // Actions
  updateShortcuts: (shortcuts: Partial<ShortcutSettings>) => void;
  updateFolders: (folders: Partial<FolderSettings>) => void;
  updateGeneral: (general: Partial<GeneralSettings>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<boolean>;
  resetToDefaults: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,
  hasUnsavedChanges: false,

  updateShortcuts: (shortcuts) => {
    set((state) => ({
      settings: {
        ...state.settings,
        shortcuts: { ...state.settings.shortcuts, ...shortcuts },
      },
      hasUnsavedChanges: true,
    }));
  },

  updateFolders: (folders) => {
    set((state) => ({
      settings: {
        ...state.settings,
        folders: { ...state.settings.folders, ...folders },
      },
      hasUnsavedChanges: true,
    }));
  },

  updateGeneral: (general) => {
    set((state) => ({
      settings: {
        ...state.settings,
        general: { ...state.settings.general, ...general },
      },
      hasUnsavedChanges: true,
    }));
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
      hasUnsavedChanges: true,
    }));
  },

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const savedSettings = await window.electronAPI?.getSettings();
      if (savedSettings) {
        set({
          settings: { ...defaultSettings, ...savedSettings },
          hasUnsavedChanges: false,
        });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  saveSettings: async () => {
    const { settings } = get();
    try {
      const success = await window.electronAPI?.saveSettings(settings);
      if (success) {
        set({ hasUnsavedChanges: false });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  },

  resetToDefaults: () => {
    set({
      settings: defaultSettings,
      hasUnsavedChanges: true,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
