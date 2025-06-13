import React from 'react';
import { Minimize2, Maximize2, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    window.electronAPI?.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximizeWindow();
  };

  const handleClose = () => {
    window.electronAPI?.quitApp();
  };

  return (
    <div className="titlebar-drag h-8 bg-gray-800/90 dark:bg-gray-800/90 bg-gray-100/90 backdrop-blur-sm border-b border-gray-700/50 dark:border-gray-700/50 border-gray-200/50 flex items-center justify-between px-4">
      {/* App Title */}
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md shadow-sm"></div>
        <span className="text-sm font-medium text-gray-300 dark:text-gray-300 text-gray-700">KwikShot</span>
      </div>

      {/* Center - Theme Toggle */}
      <div className="titlebar-no-drag">
        <ThemeToggle />
      </div>

      {/* Window Controls (Windows style) */}
      {process.platform !== 'darwin' && (
        <div className="titlebar-no-drag flex items-center space-x-1">
          <button
            onClick={handleMinimize}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-700/80 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Minimize2 size={14} className="text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-700/80 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <Maximize2 size={14} className="text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-red-600/80 rounded-lg transition-all duration-200 hover:scale-105"
          >
            <X size={14} className="text-gray-400 hover:text-white" />
          </button>
        </div>
      )}
    </div>
  );
};
