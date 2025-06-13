import { create } from 'zustand';

export interface RecordingSettings {
  quality: '720p' | '1080p' | '1440p' | '4k';
  frameRate: 30 | 60;
  includeAudio: boolean;
  includeSystemAudio: boolean;
  includeMicrophone: boolean;
  selectedSource?: Electron.DesktopCapturerSource;
}

export interface RecordingState {
  // Recording status
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  
  // Recording data
  duration: number;
  recordedBlob: Blob | null;
  mediaRecorder: MediaRecorder | null;
  mediaStream: MediaStream | null;
  
  // Settings
  settings: RecordingSettings;
  
  // Available sources
  availableSources: Electron.DesktopCapturerSource[];
  
  // Error handling
  error: string | null;
  
  // Actions
  setRecording: (isRecording: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  setProcessing: (isProcessing: boolean) => void;
  setDuration: (duration: number) => void;
  incrementDuration: () => void;
  setRecordedBlob: (blob: Blob | null) => void;
  setMediaRecorder: (recorder: MediaRecorder | null) => void;
  setMediaStream: (stream: MediaStream | null) => void;
  updateSettings: (settings: Partial<RecordingSettings>) => void;
  setAvailableSources: (sources: Electron.DesktopCapturerSource[]) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultSettings: RecordingSettings = {
  quality: '1080p',
  frameRate: 30,
  includeAudio: true,
  includeSystemAudio: true,
  includeMicrophone: false,
};

export const useRecordingStore = create<RecordingState>((set) => ({
  // Initial state
  isRecording: false,
  isPaused: false,
  isProcessing: false,
  duration: 0,
  recordedBlob: null,
  mediaRecorder: null,
  mediaStream: null,
  settings: defaultSettings,
  availableSources: [],
  error: null,
  
  // Actions
  setRecording: (isRecording) => set({ isRecording }),
  setPaused: (isPaused) => set({ isPaused }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setDuration: (duration) => set({ duration }),
  incrementDuration: () => set((state) => ({ duration: state.duration + 1 })),
  setRecordedBlob: (recordedBlob) => set({ recordedBlob }),
  setMediaRecorder: (mediaRecorder) => set({ mediaRecorder }),
  setMediaStream: (mediaStream) => set({ mediaStream }),
  updateSettings: (newSettings) => 
    set((state) => ({ 
      settings: { ...state.settings, ...newSettings } 
    })),
  setAvailableSources: (availableSources) => set({ availableSources }),
  setError: (error) => set({ error }),
  reset: () => set({
    isRecording: false,
    isPaused: false,
    isProcessing: false,
    duration: 0,
    recordedBlob: null,
    mediaRecorder: null,
    mediaStream: null,
    error: null,
  }),
}));
