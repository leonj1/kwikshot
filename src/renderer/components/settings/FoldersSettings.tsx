import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  Video,
  FileText,
  Music,
  Download,
  Camera,
  RotateCcw,
  ExternalLink,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { FolderSettings } from '../../../shared/types';
import { useAutoSaveToast } from '../../contexts/ToastContext';

interface FolderItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
  path: string;
  onBrowse: () => void;
  onOpenFolder: () => void;
  saveStatus?: 'idle' | 'saving' | 'success' | 'error';
  errorMessage?: string;
}

const FolderItem: React.FC<FolderItemProps> = ({
  icon: Icon,
  label,
  description,
  path,
  onBrowse,
  onOpenFolder,
  saveStatus = 'idle',
  errorMessage,
}) => {
  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Loader size={14} className="text-blue-400 animate-spin" />;
      case 'success':
        return <Check size={14} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={14} className="text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved!';
      case 'error':
        return errorMessage || 'Save failed';
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`p-4 bg-gray-800 rounded-xl border transition-all duration-200 ${
        saveStatus === 'success'
          ? 'border-green-500/50 bg-green-900/10'
          : saveStatus === 'error'
          ? 'border-red-500/50 bg-red-900/10'
          : saveStatus === 'saving'
          ? 'border-blue-500/50 bg-blue-900/10'
          : 'border-gray-700 hover:border-gray-600'
      }`}
      whileHover={{ scale: saveStatus === 'idle' ? 1.01 : 1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-700 rounded-lg">
            <Icon size={20} className="text-blue-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-white">{label}</h3>
              {saveStatus !== 'idle' && (
                <div className="flex items-center space-x-1">
                  {getStatusIcon()}
                  <span className={`text-xs font-medium ${
                    saveStatus === 'success' ? 'text-green-400' :
                    saveStatus === 'error' ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    {getStatusText()}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-2">{description}</p>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300 font-mono">
                {path}
              </code>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenFolder}
            disabled={saveStatus === 'saving'}
            className={`p-2 rounded-lg transition-colors ${
              saveStatus === 'saving'
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Open folder"
          >
            <ExternalLink size={16} />
          </button>

          <button
            onClick={onBrowse}
            disabled={saveStatus === 'saving'}
            className={`btn-secondary flex items-center space-x-2 ${
              saveStatus === 'saving' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FolderOpen size={16} />
            <span>Browse</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const FoldersSettings: React.FC = () => {
  const { settings, updateFolders, saveSettings } = useSettingsStore();
  const autoSaveToast = useAutoSaveToast();

  // Auto-save settings when folders actually change (but not on initial load)
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastSavedSettings, setLastSavedSettings] = useState<string>('');

  useEffect(() => {
    // Skip auto-save on initial load
    if (isInitialLoad) {
      setIsInitialLoad(false);
      setLastSavedSettings(JSON.stringify(settings.folders));
      return;
    }

    // Check if settings actually changed by comparing serialized values
    const currentSettingsString = JSON.stringify(settings.folders);
    if (currentSettingsString === lastSavedSettings) {
      return; // No actual change, skip auto-save
    }

    const autoSave = async () => {
      // Only show toast when actually calling saveSettings
      autoSaveToast.showSaving();
      try {
        console.log('Auto-saving folder settings...', settings.folders);
        const success = await saveSettings();
        if (success) {
          setLastSavedSettings(currentSettingsString);
          autoSaveToast.showSuccess();
        } else {
          autoSaveToast.showError();
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
        autoSaveToast.showError();
      }
    };

    // Debounce auto-save to avoid excessive saves (no toast during debounce)
    const timeoutId = setTimeout(autoSave, 500);
    return () => clearTimeout(timeoutId);
  }, [settings.folders, saveSettings, isInitialLoad, autoSaveToast, lastSavedSettings]);

  const validateFolderPath = (path: string): string | null => {
    if (!path || path.trim().length === 0) {
      return 'Folder path cannot be empty';
    }

    // Basic path validation
    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(path)) {
      return 'Folder path contains invalid characters';
    }

    return null;
  };



  const handleFolderSelect = async (folderType: FolderPathKeys) => {
    try {
      const selectedPath = await window.electronAPI?.selectDirectory();
      if (selectedPath) {
        // Validate the selected path
        const validationError = validateFolderPath(selectedPath);
        if (validationError) {
          autoSaveToast.showError();
          return;
        }

        // Show saving toast only when actually saving
        autoSaveToast.showSaving();

        // Update the folder in the store
        updateFolders({ [folderType]: selectedPath });

        // Save to persistent storage
        const saveSuccess = await saveSettings();
        if (saveSuccess) {
          autoSaveToast.showSuccess();
        } else {
          autoSaveToast.showError();
        }
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
      autoSaveToast.showError();
    }
  };

  const handleOpenFolder = async (path: string) => {
    try {
      await window.electronAPI?.openFolder(path);
    } catch (error) {
      console.error('Failed to open folder:', error);
      // Could add a toast notification here
    }
  };

  const resetToDefaults = async () => {
    if (window.confirm('Reset all folder paths to defaults? This will overwrite all your custom folder locations.')) {
      autoSaveToast.showSaving();

      try {
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

        updateFolders(defaultFolders);

        // Save to persistent storage
        const saveSuccess = await saveSettings();
        if (saveSuccess) {
          autoSaveToast.showSuccess();
        } else {
          autoSaveToast.showError();
        }
      } catch (error) {
        console.error('Failed to reset folders:', error);
        autoSaveToast.showError();
      }
    }
  };

  type FolderPathKeys = 'recordings' | 'projects' | 'tracks' | 'exports' | 'screenshots';

  const folderDefinitions = [
    {
      key: 'recordings' as FolderPathKeys,
      icon: Video,
      label: 'Recordings',
      description: 'Default location for saving screen recordings'
    },
    {
      key: 'projects' as FolderPathKeys,
      icon: FileText,
      label: 'Projects',
      description: 'Default location for saving video projects'
    },
    {
      key: 'tracks' as FolderPathKeys,
      icon: Music,
      label: 'Audio Tracks',
      description: 'Default location for saving audio tracks and voiceovers'
    },
    {
      key: 'exports' as FolderPathKeys,
      icon: Download,
      label: 'Exports',
      description: 'Default location for exported videos and final outputs'
    },
    {
      key: 'screenshots' as FolderPathKeys,
      icon: Camera,
      label: 'Screenshots',
      description: 'Default location for saving screenshots'
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Folder size={24} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Favorite Folders</h2>
              <p className="text-gray-400">Set default save locations for your content</p>
            </div>
          </div>
          
          <button
            onClick={resetToDefaults}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Reset to Defaults</span>
          </button>
        </div>



        {/* Info Banner */}
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
          <div className="flex items-start space-x-3">
            <Folder size={20} className="text-green-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-300 mb-1">Folder Organization</h3>
              <ul className="text-sm text-green-200 space-y-1">
                <li>• <strong>Auto-save:</strong> Folder changes are saved automatically</li>
                <li>• <strong>Validation:</strong> Paths are validated before saving</li>
                <li>• <strong>Organization:</strong> Dedicated folders for different file types</li>
                <li>• <strong>Creation:</strong> Folders will be created automatically if they don't exist</li>
                <li>• <strong>Flexibility:</strong> You can change these paths at any time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="font-medium text-white mb-3 flex items-center space-x-2">
            <Download size={18} />
            <span>Storage Information</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">--</div>
              <div className="text-gray-400">Total Recordings</div>
            </div>
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">--</div>
              <div className="text-gray-400">Storage Used</div>
            </div>
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-1">--</div>
              <div className="text-gray-400">Available Space</div>
            </div>
          </div>
        </div>

        {/* Folders List */}
        <div className="space-y-4">
          {folderDefinitions.map((def) => (
            <FolderItem
              key={def.key}
              icon={def.icon}
              label={def.label}
              description={def.description}
              path={settings.folders[def.key]}
              onBrowse={() => handleFolderSelect(def.key)}
              onOpenFolder={() => handleOpenFolder(settings.folders[def.key])}
              saveStatus="idle"
              errorMessage=""
            />
          ))}
        </div>

        {/* Additional Options */}
        <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="font-medium text-white mb-4">Folder Options</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                checked={settings.folders.createFoldersAutomatically}
                onChange={(e) => {
                  updateFolders({ createFoldersAutomatically: e.target.checked });
                }}
              />
              <span className="text-gray-300">Create folders automatically if they don't exist</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                checked={settings.folders.openFolderAfterSaving}
                onChange={(e) => {
                  updateFolders({ openFolderAfterSaving: e.target.checked });
                }}
              />
              <span className="text-gray-300">Open folder after saving files</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                checked={settings.folders.organizeByDate}
                onChange={(e) => {
                  updateFolders({ organizeByDate: e.target.checked });
                }}
              />
              <span className="text-gray-300">Organize files by date (create subfolders by month)</span>
            </label>
          </div>
        </div>

        {/* Development Debug Section */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
            <h3 className="font-medium text-white mb-4">Debug Information</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p><strong>Current folder settings:</strong></p>
              <div className="bg-gray-900 p-3 rounded-lg font-mono text-xs">
                <pre>{JSON.stringify(settings.folders, null, 2)}</pre>
              </div>
              <p><strong>Toast notifications:</strong> Using optimized auto-save toasts</p>
              <p className="text-xs text-gray-500 mt-4">
                Note: Folder changes are automatically saved to persistent storage.
                Navigate away and return to test persistence.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
