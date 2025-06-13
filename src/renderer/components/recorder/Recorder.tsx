import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Pause, Monitor, Camera, Mic } from 'lucide-react';

interface RecorderProps {
  onSwitchToEditor: () => void;
}

export const Recorder: React.FC<RecorderProps> = ({ onSwitchToEditor }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [sources, setSources] = useState<Electron.DesktopCapturerSource[]>([]);

  useEffect(() => {
    // Load available sources
    loadSources();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const loadSources = async () => {
    try {
      const availableSources = await window.electronAPI?.getSources();
      setSources(availableSources || []);
    } catch (error) {
      console.error('Failed to load sources:', error);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setDuration(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setDuration(0);
    // Switch to editor after stopping
    setTimeout(() => {
      onSwitchToEditor();
    }, 500);
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-2">Screen Recorder</h1>
        <p className="text-gray-400">Capture your screen, webcam, and audio with professional quality</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Recording Controls */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Recording Controls</h2>
            
            {/* Status */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {isRecording && (
                  <div className="recording-indicator"></div>
                )}
                <span className="text-lg font-mono">
                  {formatDuration(duration)}
                </span>
                <span className="text-gray-400">
                  {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready'}
                </span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-4">
              {!isRecording ? (
                <motion.button
                  onClick={handleStartRecording}
                  className="btn-primary flex items-center space-x-2 px-6 py-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={20} />
                  <span>Start Recording</span>
                </motion.button>
              ) : (
                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={handlePauseRecording}
                    className="btn-secondary flex items-center space-x-2 px-4 py-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Pause size={20} />
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleStopRecording}
                    className="btn-danger flex items-center space-x-2 px-4 py-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Square size={20} />
                    <span>Stop & Edit</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Source Selection */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Recording Sources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Screen Sources */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Monitor size={20} className="text-primary-500" />
                  <span className="font-medium">Screens</span>
                </div>
                <div className="space-y-2">
                  {sources.filter(s => s.id.startsWith('screen')).map((source) => (
                    <div key={source.id} className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 cursor-pointer transition-colors">
                      <div className="text-sm font-medium">{source.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webcam */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Camera size={20} className="text-green-500" />
                  <span className="font-medium">Webcam</span>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400">No webcam detected</div>
                </div>
              </div>

              {/* Microphone */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mic size={20} className="text-red-500" />
                  <span className="font-medium">Microphone</span>
                </div>
                <div className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400">System default</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recording Settings */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Quality</label>
                <select className="input">
                  <option value="1080p">1080p (Recommended)</option>
                  <option value="720p">720p</option>
                  <option value="1440p">1440p</option>
                  <option value="4k">4K</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Frame Rate</label>
                <select className="input">
                  <option value="30">30 FPS</option>
                  <option value="60">60 FPS</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
