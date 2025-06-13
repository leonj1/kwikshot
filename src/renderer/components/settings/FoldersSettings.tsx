import React from 'react';
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
  ExternalLink
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { FolderSettings } from '../../../shared/types';

interface FolderItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
  path: string;
  onBrowse: () => void;
  onOpenFolder: () => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
  icon: Icon,
  label,
  description,
  path,
  onBrowse,
  onOpenFolder,
}) => {
  return (
    <motion.div
      className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gray-700 rounded-lg">
            <Icon size={20} className="text-blue-400" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-white mb-1">{label}</h3>
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
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Open folder"
          >
            <ExternalLink size={16} />
          </button>
          
          <button
            onClick={onBrowse}
            className="btn-secondary flex items-center space-x-2"
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
  const { settings, updateFolders } = useSettingsStore();

  const handleFolderSelect = async (folderType: keyof FolderSettings) => {
    try {
      const selectedPath = await window.electronAPI?.selectDirectory();
      if (selectedPath) {
        updateFolders({ [folderType]: selectedPath });
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  const handleOpenFolder = async (path: string) => {
    try {
      await window.electronAPI?.openFolder(path);
    } catch (error) {
      console.error('Failed to open folder:', error);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all folder paths to defaults?')) {
      const defaultFolders: FolderSettings = {
        recordings: '~/Documents/KwikShot/Recordings',
        projects: '~/Documents/KwikShot/Projects',
        tracks: '~/Documents/KwikShot/Tracks',
        exports: '~/Documents/KwikShot/Exports',
        screenshots: '~/Documents/KwikShot/Screenshots',
      };
      updateFolders(defaultFolders);
    }
  };

  const folderDefinitions = [
    {
      key: 'recordings' as keyof FolderSettings,
      icon: Video,
      label: 'Recordings',
      description: 'Default location for saving screen recordings'
    },
    {
      key: 'projects' as keyof FolderSettings,
      icon: FileText,
      label: 'Projects',
      description: 'Default location for saving video projects'
    },
    {
      key: 'tracks' as keyof FolderSettings,
      icon: Music,
      label: 'Audio Tracks',
      description: 'Default location for saving audio tracks and voiceovers'
    },
    {
      key: 'exports' as keyof FolderSettings,
      icon: Download,
      label: 'Exports',
      description: 'Default location for exported videos and final outputs'
    },
    {
      key: 'screenshots' as keyof FolderSettings,
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
                <li>• Organize your content with dedicated folders for different file types</li>
                <li>• Folders will be created automatically if they don't exist</li>
                <li>• You can change these paths at any time</li>
                <li>• Use the browse button to select custom locations</li>
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
            />
          ))}
        </div>

        {/* Additional Options */}
        <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="font-medium text-white mb-4">Folder Options</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                defaultChecked={true}
              />
              <span className="text-gray-300">Create folders automatically if they don't exist</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                defaultChecked={false}
              />
              <span className="text-gray-300">Open folder after saving files</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                defaultChecked={true}
              />
              <span className="text-gray-300">Organize files by date (create subfolders by month)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
