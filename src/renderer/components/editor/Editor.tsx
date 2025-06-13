import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Download, Video } from 'lucide-react';

interface EditorProps {
  onSwitchToRecorder: () => void;
}

export const Editor: React.FC<EditorProps> = ({ onSwitchToRecorder }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [duration] = useState(120); // 2 minutes example

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Video Editor</h1>
            <p className="text-gray-400">Edit, trim, and enhance your recordings</p>
          </div>
          <button
            onClick={onSwitchToRecorder}
            className="btn-secondary flex items-center space-x-2"
          >
            <Video size={20} />
            <span>New Recording</span>
          </button>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Preview Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Video Preview */}
          <div className="flex-1 bg-black flex items-center justify-center">
            <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Video size={64} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No video loaded</p>
                <p className="text-sm text-gray-500 mt-2">Import a video file or start a new recording</p>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center justify-center space-x-4">
              <button className="btn-ghost p-2">
                <SkipBack size={20} />
              </button>

              <motion.button
                onClick={handlePlayPause}
                className="btn-primary p-3 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>

              <button className="btn-ghost p-2">
                <SkipForward size={20} />
              </button>

              <div className="flex items-center space-x-3 ml-8">
                <span className="text-sm font-mono">{formatTime(playhead)}</span>
                <span className="text-gray-500">/</span>
                <span className="text-sm font-mono text-gray-400">{formatTime(duration)}</span>
              </div>
              
              <button className="btn-primary ml-8 flex items-center space-x-2">
                <Download size={20} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-auto">
          <h3 className="text-lg font-semibold mb-4">Properties</h3>
          
          <div className="space-y-4">
            <div className="card p-4">
              <h4 className="font-medium mb-3">Project Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Resolution</label>
                  <select className="input text-sm">
                    <option>1920x1080</option>
                    <option>1280x720</option>
                    <option>2560x1440</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Frame Rate</label>
                  <select className="input text-sm">
                    <option>30 FPS</option>
                    <option>60 FPS</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h4 className="font-medium mb-3">Export Settings</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Format</label>
                  <select className="input text-sm">
                    <option>MP4</option>
                    <option>MOV</option>
                    <option>WebM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Quality</label>
                  <select className="input text-sm">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="h-48 bg-gray-800 border-t border-gray-700 p-4">
        <h3 className="text-sm font-semibold mb-3">Timeline</h3>
        
        <div className="space-y-2">
          {/* Video Track */}
          <div className="timeline-track">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Video</span>
              <div className="flex items-center space-x-2">
                <button className="text-xs text-gray-400 hover:text-white">M</button>
                <button className="text-xs text-gray-400 hover:text-white">S</button>
              </div>
            </div>
            <div className="h-12 bg-gray-700 rounded relative">
              {/* Example clip */}
              <div className="timeline-clip absolute left-2 top-1 bottom-1 w-32 flex items-center justify-center">
                <span className="text-xs font-medium">Clip 1</span>
              </div>
            </div>
          </div>

          {/* Audio Track */}
          <div className="timeline-track">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Audio</span>
              <div className="flex items-center space-x-2">
                <button className="text-xs text-dark-400 hover:text-white">M</button>
                <button className="text-xs text-dark-400 hover:text-white">S</button>
              </div>
            </div>
            <div className="h-8 bg-dark-700 rounded relative">
              {/* Example audio waveform */}
              <div className="absolute left-2 top-1 bottom-1 w-32 bg-green-600 rounded opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
