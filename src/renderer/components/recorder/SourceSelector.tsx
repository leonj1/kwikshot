import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, RectangleHorizontal, RefreshCw, Check } from 'lucide-react';
import { useRecordingStore } from '../../stores/recordingStore';

// Define SourceCard component first
interface SourceCardProps {
  source: Electron.DesktopCapturerSource;
  isSelected: boolean;
  onSelect: (source: Electron.DesktopCapturerSource) => void;
  disabled: boolean;
}

const SourceCard: React.FC<SourceCardProps> = ({
  source,
  isSelected,
  onSelect,
  disabled,
}) => {
  const getSourceIcon = (source: Electron.DesktopCapturerSource) => {
    if (source.id.startsWith('screen')) {
      return <Monitor size={16} className="text-blue-500" />;
    }
    return <RectangleHorizontal size={16} className="text-green-500" />;
  };

  return (
    <motion.button
      onClick={() => !disabled && onSelect(source)}
      disabled={disabled}
      className={`
        relative p-3 rounded-lg border-2 transition-all duration-200 text-left w-full
        ${isSelected
          ? 'border-blue-500 bg-blue-900/30'
          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500 hover:bg-gray-700/70'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
        >
          <Check size={12} className="text-white" />
        </motion.div>
      )}

      {/* Thumbnail */}
      <div className="aspect-video bg-gray-800 rounded mb-2 overflow-hidden">
        {source.thumbnail && (
          <img
            src={source.thumbnail.toDataURL()}
            alt={source.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Source Info */}
      <div className="flex items-center space-x-2">
        {getSourceIcon(source)}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {source.name}
          </div>
          <div className="text-xs text-gray-400">
            {source.id.startsWith('screen') ? 'Screen' : 'Window'}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export const SourceSelector: React.FC = () => {
  const {
    availableSources,
    settings,
    setAvailableSources,
    updateSettings,
    isRecording,
  } = useRecordingStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    setIsLoading(true);
    try {
      const sources = await window.electronAPI?.getSources();
      setAvailableSources(sources || []);
    } catch (error) {
      console.error('Failed to load sources:', error);
      setAvailableSources([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSourceSelect = (source: Electron.DesktopCapturerSource) => {
    if (isRecording) return;
    
    updateSettings({ selectedSource: source });
  };

  const getSourceIcon = (source: Electron.DesktopCapturerSource) => {
    if (source.id.startsWith('screen')) {
      return <Monitor size={20} className="text-blue-500" />;
    }
    return <RectangleHorizontal size={20} className="text-green-500" />;
  };

  const getSourceType = (source: Electron.DesktopCapturerSource) => {
    return source.id.startsWith('screen') ? 'Screen' : 'Window';
  };

  const screenSources = availableSources.filter(s => s.id.startsWith('screen'));
  const windowSources = availableSources.filter(s => !s.id.startsWith('screen'));

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recording Sources</h2>
        <motion.button
          onClick={loadSources}
          disabled={isLoading || isRecording}
          className="btn-ghost p-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw 
            size={16} 
            className={`${isLoading ? 'animate-spin' : ''} ${
              isRecording ? 'text-gray-500' : 'text-gray-400'
            }`} 
          />
        </motion.button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-700/50 rounded-lg shimmer"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Screen Sources */}
          {screenSources.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Monitor size={18} className="text-blue-500" />
                <span className="font-medium text-sm">Screens</span>
                <span className="text-xs text-gray-400">({screenSources.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {screenSources.map((source) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    isSelected={settings.selectedSource?.id === source.id}
                    onSelect={handleSourceSelect}
                    disabled={isRecording}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Window Sources */}
          {windowSources.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <RectangleHorizontal size={18} className="text-green-500" />
                <span className="font-medium text-sm">Windows</span>
                <span className="text-xs text-gray-400">({windowSources.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {windowSources.slice(0, 6).map((source) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    isSelected={settings.selectedSource?.id === source.id}
                    onSelect={handleSourceSelect}
                    disabled={isRecording}
                  />
                ))}
              </div>
              {windowSources.length > 6 && (
                <div className="mt-3 text-center">
                  <span className="text-sm text-gray-400">
                    +{windowSources.length - 6} more windows available
                  </span>
                </div>
              )}
            </div>
          )}

          {availableSources.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Monitor size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No sources available</p>
              <p className="text-sm text-gray-500">
                Make sure you have granted screen recording permissions
              </p>
              <motion.button
                onClick={loadSources}
                className="btn-secondary mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retry
              </motion.button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
