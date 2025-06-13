import React from 'react';
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Bell, 
  Minimize2, 
  Download, 
  Globe, 
  FileVideo,
  Save,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { GeneralSettings as GeneralSettingsType } from '../../../shared/types';

interface SettingItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description: string;
  children: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon: Icon,
  label,
  description,
  children,
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
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export const GeneralSettings: React.FC = () => {
  const { settings, updateGeneral } = useSettingsStore();

  const handleToggle = (key: keyof GeneralSettingsType) => {
    updateGeneral({ [key]: !settings.general[key] });
  };

  const handleSelectChange = (key: keyof GeneralSettingsType, value: string | number) => {
    updateGeneral({ [key]: value });
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset all general settings to defaults?')) {
      const defaultGeneral: GeneralSettingsType = {
        autoSave: true,
        autoSaveInterval: 5,
        showNotifications: true,
        minimizeToTray: false,
        startMinimized: false,
        checkForUpdates: true,
        language: 'en',
        defaultFormat: 'mp4',
      };
      updateGeneral(defaultGeneral);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Monitor size={24} className="text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-white">General Settings</h2>
              <p className="text-gray-400">Configure app behavior and preferences</p>
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

        {/* Settings List */}
        <div className="space-y-4">
          {/* Auto Save */}
          <SettingItem
            icon={Save}
            label="Auto Save"
            description="Automatically save projects while working"
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.general.autoSave}
                onChange={() => handleToggle('autoSave')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </SettingItem>

          {/* Auto Save Interval */}
          {settings.general.autoSave && (
            <SettingItem
              icon={Clock}
              label="Auto Save Interval"
              description="How often to automatically save projects"
            >
              <select
                value={settings.general.autoSaveInterval}
                onChange={(e) => handleSelectChange('autoSaveInterval', parseInt(e.target.value))}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value={1}>1 minute</option>
                <option value={2}>2 minutes</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </SettingItem>
          )}

          {/* Notifications */}
          <SettingItem
            icon={Bell}
            label="Show Notifications"
            description="Display system notifications for recording events"
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.general.showNotifications}
                onChange={() => handleToggle('showNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </SettingItem>

          {/* Minimize to Tray */}
          <SettingItem
            icon={Minimize2}
            label="Minimize to Tray"
            description="Keep app running in system tray when minimized"
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.general.minimizeToTray}
                onChange={() => handleToggle('minimizeToTray')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </SettingItem>

          {/* Start Minimized */}
          <SettingItem
            icon={Minimize2}
            label="Start Minimized"
            description="Launch app minimized to system tray"
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.general.startMinimized}
                onChange={() => handleToggle('startMinimized')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </SettingItem>

          {/* Check for Updates */}
          <SettingItem
            icon={Download}
            label="Check for Updates"
            description="Automatically check for app updates on startup"
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.general.checkForUpdates}
                onChange={() => handleToggle('checkForUpdates')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </SettingItem>

          {/* Language */}
          <SettingItem
            icon={Globe}
            label="Language"
            description="Select your preferred language"
          >
            <select
              value={settings.general.language}
              onChange={(e) => handleSelectChange('language', e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </SettingItem>

          {/* Default Format */}
          <SettingItem
            icon={FileVideo}
            label="Default Video Format"
            description="Default format for new recordings and exports"
          >
            <select
              value={settings.general.defaultFormat}
              onChange={(e) => handleSelectChange('defaultFormat', e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="mp4">MP4 (Recommended)</option>
              <option value="mov">MOV (Apple)</option>
              <option value="webm">WebM (Web)</option>
            </select>
          </SettingItem>
        </div>

        {/* App Information */}
        <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="font-medium text-white mb-4">App Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Version:</span>
              <span className="text-white ml-2">1.0.0</span>
            </div>
            <div>
              <span className="text-gray-400">Build:</span>
              <span className="text-white ml-2">2024.01.15</span>
            </div>
            <div>
              <span className="text-gray-400">Platform:</span>
              <span className="text-white ml-2">{navigator.platform}</span>
            </div>
            <div>
              <span className="text-gray-400">Electron:</span>
              <span className="text-white ml-2">36.4.0</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              Built with ❤️ using{' '}
              <a 
                href="https://www.augmentcode.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                AugmentCode
              </a>
              {' '}community tools
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
