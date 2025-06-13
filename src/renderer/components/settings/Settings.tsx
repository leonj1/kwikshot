import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Keyboard, 
  Folder, 
  Monitor, 
  Save, 
  RotateCcw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { ShortcutsSettings } from './ShortcutsSettings';
import { FoldersSettings } from './FoldersSettings';
import { GeneralSettings } from './GeneralSettings';

interface SettingsProps {
  onClose?: () => void;
}

type SettingsTab = 'general' | 'shortcuts' | 'folders';

export const Settings: React.FC<SettingsProps> = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const {
    isLoading,
    hasUnsavedChanges,
    loadSettings,
    saveSettings,
    resetToDefaults
  } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async () => {
    setSaveStatus('saving');
    const success = await saveSettings();
    setSaveStatus(success ? 'success' : 'error');
    
    setTimeout(() => {
      setSaveStatus('idle');
    }, 2000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      resetToDefaults();
    }
  };

  const tabs = [
    {
      id: 'general' as const,
      label: 'General',
      icon: Monitor,
      description: 'App preferences and behavior'
    },
    {
      id: 'shortcuts' as const,
      label: 'Shortcuts',
      icon: Keyboard,
      description: 'Keyboard shortcuts'
    },
    {
      id: 'folders' as const,
      label: 'Folders',
      icon: Folder,
      description: 'Default save locations'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'shortcuts':
        return <ShortcutsSettings />;
      case 'folders':
        return <FoldersSettings />;
      default:
        return null;
    }
  };

  const getSaveButtonIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      default:
        return <Save size={16} />;
    }
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'success':
        return 'Saved!';
      case 'error':
        return 'Error';
      default:
        return hasUnsavedChanges ? 'Save Now' : 'All Saved';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SettingsIcon size={24} className="text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-gray-400">Configure KwikShot preferences</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center space-x-2"
              disabled={saveStatus === 'saving'}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || saveStatus === 'saving'}
              className={`btn-primary flex items-center space-x-2 ${
                !hasUnsavedChanges ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                saveStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : ''
              } ${
                saveStatus === 'error' ? 'bg-red-600 hover:bg-red-700' : ''
              }`}
            >
              {getSaveButtonIcon()}
              <span>{getSaveButtonText()}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-3 text-left rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
