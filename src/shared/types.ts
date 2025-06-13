// Recording types
export interface RecordingSource {
  id: string;
  name: string;
  type: 'screen' | 'window' | 'webcam' | 'microphone';
  thumbnail?: string;
}

export interface RecordingSettings {
  resolution: '720p' | '1080p' | '1440p' | '4k';
  frameRate: 30 | 60;
  quality: 'low' | 'medium' | 'high' | 'lossless';
  format: 'mp4' | 'mov' | 'webm';
  outputDirectory: string;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  sources: RecordingSource[];
  settings: RecordingSettings;
}

// Editor types
export interface TimelineTrack {
  id: string;
  type: 'video' | 'audio';
  name: string;
  clips: TimelineClip[];
  muted: boolean;
  volume: number;
}

export interface TimelineClip {
  id: string;
  trackId: string;
  startTime: number;
  endTime: number;
  duration: number;
  sourceFile: string;
  trimStart: number;
  trimEnd: number;
}

export interface EditorState {
  project: Project | null;
  timeline: TimelineTrack[];
  playhead: number;
  isPlaying: boolean;
  selectedClips: string[];
  zoomLevel: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  settings: ProjectSettings;
  timeline: TimelineTrack[];
}

export interface ProjectSettings {
  resolution: { width: number; height: number };
  frameRate: number;
  duration: number;
}

// UI types
export interface AppSettings {
  theme: 'dark' | 'light';
  shortcuts: ShortcutSettings;
  recording: RecordingSettings;
  editor: {
    autoSave: boolean;
    autoSaveInterval: number;
    previewQuality: 'low' | 'medium' | 'high';
  };
  folders: FolderSettings;
  general: GeneralSettings;
}

// Shortcut settings
export interface ShortcutSettings {
  startRecording: string;
  stopRecording: string;
  pauseRecording: string;
  resumeRecording: string;
  takeScreenshot: string;
  openSettings: string;
  newProject: string;
  saveProject: string;
  exportVideo: string;
  toggleFullscreen: string;
}

// Folder settings
export interface FolderSettings {
  recordings: string;
  projects: string;
  tracks: string;
  exports: string;
  screenshots: string;
  // Folder behavior options
  createFoldersAutomatically: boolean;
  openFolderAfterSaving: boolean;
  organizeByDate: boolean;
}

// General settings
export interface GeneralSettings {
  autoSave: boolean;
  autoSaveInterval: number; // in minutes
  showNotifications: boolean;
  minimizeToTray: boolean;
  startMinimized: boolean;
  checkForUpdates: boolean;
  language: string;
  defaultFormat: 'mp4' | 'mov' | 'webm';
}

// Media device types
export interface MediaDevice {
  deviceId: string;
  label: string;
  kind: 'videoinput' | 'audioinput' | 'audiooutput';
}

// Export types
export interface ExportSettings {
  format: 'mp4' | 'mov' | 'webm' | 'gif';
  quality: 'low' | 'medium' | 'high' | 'lossless';
  resolution: { width: number; height: number };
  frameRate: number;
  outputPath: string;
}
