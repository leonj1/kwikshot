import React from 'react';
import { motion } from 'framer-motion';
import { Play, Square, Pause, AlertCircle, Loader2 } from 'lucide-react';
import { useRecordingStore } from '../../stores/recordingStore';

interface RecordingControlsProps {
  onStartRecording: () => Promise<void>;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
}) => {
  const {
    isRecording,
    isPaused,
    isProcessing,
    duration,
    error,
    settings,
  } = useRecordingStore();

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = (): string => {
    if (isProcessing) return 'Processing...';
    if (isRecording && isPaused) return 'Paused';
    if (isRecording) return 'Recording';
    return 'Ready';
  };

  const getStatusColor = (): string => {
    if (error) return 'text-red-400';
    if (isProcessing) return 'text-yellow-400';
    if (isRecording && isPaused) return 'text-yellow-400';
    if (isRecording) return 'text-green-400';
    return 'text-gray-400';
  };

  const handleStartClick = async () => {
    if (!settings.selectedSource) {
      return;
    }
    
    try {
      await onStartRecording();
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const handlePauseClick = () => {
    if (isPaused) {
      onResumeRecording();
    } else {
      onPauseRecording();
    }
  };

  const canStartRecording = !isRecording && !isProcessing && settings.selectedSource;

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold mb-4">Recording Controls</h2>
      
      {/* Status Display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Recording Indicator */}
          {isRecording && !isPaused && (
            <div className="recording-indicator"></div>
          )}
          
          {/* Processing Indicator */}
          {isProcessing && (
            <Loader2 size={16} className="text-yellow-400 animate-spin" />
          )}
          
          {/* Duration */}
          <span className="text-2xl font-mono font-bold">
            {formatDuration(duration)}
          </span>
          
          {/* Status Text */}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Recording Info */}
        {isRecording && (
          <div className="text-sm text-gray-400">
            <div>{settings.quality} • {settings.frameRate}fps</div>
            {settings.includeSystemAudio && (
              <div className="text-xs">System audio included</div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-900/50 border border-red-700/50 rounded-lg flex items-center space-x-2"
        >
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-200">{error}</span>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <motion.button
            onClick={handleStartClick}
            disabled={!canStartRecording || isProcessing}
            className={`btn-primary flex items-center space-x-2 px-6 py-3 ${
              !canStartRecording || isProcessing 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
            whileHover={canStartRecording && !isProcessing ? { scale: 1.05 } : {}}
            whileTap={canStartRecording && !isProcessing ? { scale: 0.95 } : {}}
          >
            {isProcessing ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Play size={20} />
            )}
            <span>
              {isProcessing ? 'Starting...' : 'Start Recording'}
            </span>
          </motion.button>
        ) : (
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={handlePauseClick}
              disabled={isProcessing}
              className="btn-secondary flex items-center space-x-2 px-4 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause size={20} />
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </motion.button>
            
            <motion.button
              onClick={onStopRecording}
              disabled={isProcessing}
              className="btn-danger flex items-center space-x-2 px-4 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Square size={20} />
              <span>Stop & Save</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Recording Tips */}
      {!isRecording && !settings.selectedSource && (
        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-lg">
          <p className="text-sm text-blue-200">
            💡 Select a screen or window source below to start recording
          </p>
        </div>
      )}

      {!isRecording && settings.selectedSource && (
        <div className="mt-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
          <p className="text-sm text-green-200">
            ✓ Ready to record "{settings.selectedSource.name}"
          </p>
        </div>
      )}
    </div>
  );
};
