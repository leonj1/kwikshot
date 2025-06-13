import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, Mic, MicOff, VolumeX } from 'lucide-react';
import { useRecordingStore } from '../../stores/recordingStore';

export const RecordingSettings: React.FC = () => {
  const { settings, updateSettings, isRecording } = useRecordingStore();

  const handleQualityChange = (quality: '720p' | '1080p' | '1440p' | '4k') => {
    if (isRecording) return;
    updateSettings({ quality });
  };

  const handleFrameRateChange = (frameRate: 30 | 60) => {
    if (isRecording) return;
    updateSettings({ frameRate });
  };

  const handleAudioToggle = (audioType: 'system' | 'microphone') => {
    if (isRecording) return;
    
    if (audioType === 'system') {
      updateSettings({ 
        includeSystemAudio: !settings.includeSystemAudio,
        includeAudio: !settings.includeSystemAudio || settings.includeMicrophone
      });
    } else {
      updateSettings({ 
        includeMicrophone: !settings.includeMicrophone,
        includeAudio: settings.includeSystemAudio || !settings.includeMicrophone
      });
    }
  };

  const qualityOptions = [
    { value: '720p', label: '720p HD', description: 'Good quality, smaller file' },
    { value: '1080p', label: '1080p Full HD', description: 'Recommended' },
    { value: '1440p', label: '1440p QHD', description: 'High quality' },
    { value: '4k', label: '4K Ultra HD', description: 'Best quality, large file' },
  ] as const;

  const frameRateOptions = [
    { value: 30, label: '30 FPS', description: 'Standard' },
    { value: 60, label: '60 FPS', description: 'Smooth motion' },
  ] as const;

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings size={20} className="text-gray-400" />
        <h2 className="text-lg font-semibold">Recording Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Video Quality */}
        <div>
          <label className="block text-sm font-medium mb-3">Video Quality</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {qualityOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleQualityChange(option.value)}
                disabled={isRecording}
                className={`
                  p-3 rounded-lg border-2 text-left transition-all duration-200
                  ${settings.quality === option.value
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  }
                  ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                whileHover={!isRecording ? { scale: 1.02 } : {}}
                whileTap={!isRecording ? { scale: 0.98 } : {}}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-400">{option.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Frame Rate */}
        <div>
          <label className="block text-sm font-medium mb-3">Frame Rate</label>
          <div className="grid grid-cols-2 gap-3">
            {frameRateOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleFrameRateChange(option.value)}
                disabled={isRecording}
                className={`
                  p-3 rounded-lg border-2 text-left transition-all duration-200
                  ${settings.frameRate === option.value
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  }
                  ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                whileHover={!isRecording ? { scale: 1.02 } : {}}
                whileTap={!isRecording ? { scale: 0.98 } : {}}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-400">{option.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Audio Settings */}
        <div>
          <label className="block text-sm font-medium mb-3">Audio Sources</label>
          <div className="space-y-3">
            {/* System Audio */}
            <motion.button
              onClick={() => handleAudioToggle('system')}
              disabled={isRecording}
              className={`
                w-full p-3 rounded-lg border-2 text-left transition-all duration-200 flex items-center space-x-3
                ${settings.includeSystemAudio
                  ? 'border-green-500 bg-green-900/30'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }
                ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              whileHover={!isRecording ? { scale: 1.02 } : {}}
              whileTap={!isRecording ? { scale: 0.98 } : {}}
            >
              {settings.includeSystemAudio ? (
                <Volume2 size={20} className="text-green-500" />
              ) : (
                <VolumeX size={20} className="text-gray-400" />
              )}
              <div className="flex-1">
                <div className="font-medium">System Audio</div>
                <div className="text-xs text-gray-400">
                  Record computer sounds and music
                </div>
              </div>
              <div className={`
                w-4 h-4 rounded-full border-2 transition-all duration-200
                ${settings.includeSystemAudio 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-400'
                }
              `}>
                {settings.includeSystemAudio && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full bg-green-500 rounded-full"
                  />
                )}
              </div>
            </motion.button>

            {/* Microphone */}
            <motion.button
              onClick={() => handleAudioToggle('microphone')}
              disabled={isRecording}
              className={`
                w-full p-3 rounded-lg border-2 text-left transition-all duration-200 flex items-center space-x-3
                ${settings.includeMicrophone
                  ? 'border-red-500 bg-red-900/30'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                }
                ${isRecording ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              whileHover={!isRecording ? { scale: 1.02 } : {}}
              whileTap={!isRecording ? { scale: 0.98 } : {}}
            >
              {settings.includeMicrophone ? (
                <Mic size={20} className="text-red-500" />
              ) : (
                <MicOff size={20} className="text-gray-400" />
              )}
              <div className="flex-1">
                <div className="font-medium">Microphone</div>
                <div className="text-xs text-gray-400">
                  Record your voice commentary
                </div>
              </div>
              <div className={`
                w-4 h-4 rounded-full border-2 transition-all duration-200
                ${settings.includeMicrophone 
                  ? 'bg-red-500 border-red-500' 
                  : 'border-gray-400'
                }
              `}>
                {settings.includeMicrophone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full bg-red-500 rounded-full"
                  />
                )}
              </div>
            </motion.button>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/50">
          <div className="text-sm font-medium mb-2">Current Settings</div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Quality: {settings.quality} @ {settings.frameRate}fps</div>
            <div>
              Audio: {
                settings.includeSystemAudio && settings.includeMicrophone
                  ? 'System + Microphone'
                  : settings.includeSystemAudio
                  ? 'System only'
                  : settings.includeMicrophone
                  ? 'Microphone only'
                  : 'No audio'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
