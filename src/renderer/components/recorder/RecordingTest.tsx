import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Square, CheckCircle, AlertCircle, Monitor } from 'lucide-react';
import { ScreenRecordingService } from '../../services/ScreenRecordingService';

export const RecordingTest: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const recordingService = new ScreenRecordingService();

  const startTest = async () => {
    try {
      setError(null);
      setRecordedBlob(null);
      setDuration(0);

      // Check capabilities
      const capabilities = ScreenRecordingService.getCapabilities();
      if (!capabilities.supportsDisplayMedia) {
        throw new Error('Display media not supported');
      }

      // Get display media
      const stream = await recordingService.getDisplayMedia({
        quality: '1080p',
        frameRate: 30,
        includeAudio: true,
        includeSystemAudio: true,
        includeMicrophone: false,
      });

      // Start recording
      await recordingService.startRecording(stream, {
        quality: '1080p',
        frameRate: 30,
        includeAudio: true,
        includeSystemAudio: true,
        includeMicrophone: false,
      }, {
        onStop: (blob) => {
          setRecordedBlob(blob);
          setIsRecording(false);
        },
        onError: (err) => {
          setError(err.message);
          setIsRecording(false);
        },
      });

      setIsRecording(true);

      // Start duration timer
      const interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      // Auto-stop after 10 seconds for testing
      setTimeout(() => {
        recordingService.stopRecording();
        clearInterval(interval);
      }, 10000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const stopTest = () => {
    recordingService.stopRecording();
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;

      // Determine file extension based on MIME type
      const preferredMimeType = ScreenRecordingService.getPreferredMimeType();
      const isMP4 = preferredMimeType?.includes('mp4') || recordedBlob.type.includes('mp4');
      const extension = isMP4 ? 'mp4' : 'webm';

      a.download = `test-recording-${Date.now()}.${extension}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const capabilities = ScreenRecordingService.getCapabilities();
  const preferredFormat = ScreenRecordingService.getPreferredMimeType();
  const isMP4Preferred = preferredFormat?.includes('mp4') || false;

  // Enhanced debugging information
  const debugInfo = {
    hasNavigator: typeof navigator !== 'undefined',
    hasMediaDevices: typeof navigator?.mediaDevices !== 'undefined',
    hasGetDisplayMedia: typeof navigator?.mediaDevices?.getDisplayMedia !== 'undefined',
    hasGetUserMedia: typeof navigator?.mediaDevices?.getUserMedia !== 'undefined',
    hasMediaRecorder: typeof MediaRecorder !== 'undefined',
    userAgent: navigator?.userAgent || 'Unknown',
    isElectron: typeof window !== 'undefined' && window.process?.type === 'renderer',
    electronVersion: window.process?.versions?.electron || 'Not Electron',
    chromeVersion: window.process?.versions?.chrome || 'Unknown',
  };

  return (
    <div className="card p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Monitor size={20} />
        <span>Screen Recording Test</span>
      </h3>

      {/* Enhanced Capabilities */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          {capabilities.supportsDisplayMedia ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <AlertCircle size={16} className="text-red-500" />
          )}
          <span className="text-sm">Display Media: {capabilities.supportsDisplayMedia ? 'Supported' : 'Not Supported'}</span>
        </div>

        <div className="flex items-center space-x-2">
          {capabilities.supportsMediaRecorder ? (
            <CheckCircle size={16} className="text-green-500" />
          ) : (
            <AlertCircle size={16} className="text-red-500" />
          )}
          <span className="text-sm">Media Recorder: {capabilities.supportsMediaRecorder ? 'Supported' : 'Not Supported'}</span>
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <div className="flex items-center space-x-2">
            <span>Preferred format:</span>
            <span className={`font-medium ${isMP4Preferred ? 'text-green-400' : 'text-yellow-400'}`}>
              {preferredFormat || 'None'}
            </span>
            {isMP4Preferred && <span className="text-green-400">✓ MP4</span>}
          </div>
          <div>All formats: {capabilities.supportedMimeTypes.join(', ') || 'None'}</div>
        </div>
      </div>

      {/* Debug Information */}
      <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
        <div className="text-sm font-medium mb-2">Debug Information:</div>
        <div className="text-xs text-gray-400 space-y-1">
          <div>Navigator: {debugInfo.hasNavigator ? '✓' : '✗'}</div>
          <div>MediaDevices: {debugInfo.hasMediaDevices ? '✓' : '✗'}</div>
          <div>getDisplayMedia: {debugInfo.hasGetDisplayMedia ? '✓' : '✗'}</div>
          <div>getUserMedia: {debugInfo.hasGetUserMedia ? '✓' : '✗'}</div>
          <div>MediaRecorder: {debugInfo.hasMediaRecorder ? '✓' : '✗'}</div>
          <div>Electron: {debugInfo.isElectron ? '✓' : '✗'} ({debugInfo.electronVersion})</div>
          <div>Chrome: {debugInfo.chromeVersion}</div>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          {isRecording && <div className="recording-indicator"></div>}
          <span className="font-mono text-lg">{formatDuration(duration)}</span>
          <span className="text-sm text-gray-400">
            {isRecording ? 'Recording...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-sm text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        {!isRecording ? (
          <motion.button
            onClick={startTest}
            disabled={!capabilities.supportsDisplayMedia}
            className="btn-primary w-full flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={16} />
            <span>Start 10s Test Recording {isMP4Preferred ? '(MP4)' : '(WebM)'}</span>
          </motion.button>
        ) : (
          <motion.button
            onClick={stopTest}
            className="btn-danger w-full flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Square size={16} />
            <span>Stop Recording</span>
          </motion.button>
        )}

        {recordedBlob && (
          <motion.button
            onClick={downloadRecording}
            className="btn-secondary w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Download Recording ({Math.round(recordedBlob.size / 1024 / 1024 * 100) / 100} MB)
          </motion.button>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        This test will record your screen for 10 seconds and allow you to download the result as {isMP4Preferred ? 'MP4' : 'WebM'} format.
      </div>
    </div>
  );
};
