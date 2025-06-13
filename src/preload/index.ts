import { contextBridge, ipcRenderer } from 'electron';

// Define the API interface
export interface ElectronAPI {
  // Screen capture
  getSources: () => Promise<Electron.DesktopCapturerSource[]>;
  getMediaDevices: () => Promise<{ success: boolean; error?: string }>;
  
  // Window controls
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  quitApp: () => Promise<void>;
  
  // File operations
  selectDirectory: () => Promise<string | null>;
  saveFile: (data: any, filename: string) => Promise<boolean>;
  
  // Settings
  getSettings: () => Promise<any>;
  saveSettings: (settings: any) => Promise<boolean>;
}

// Expose the API to the renderer process
const electronAPI: ElectronAPI = {
  // Screen capture
  getSources: () => ipcRenderer.invoke('get-sources'),
  getMediaDevices: () => ipcRenderer.invoke('get-media-devices'),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  
  // File operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  saveFile: (data: any, filename: string) => ipcRenderer.invoke('save-file', data, filename),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
};

// Expose the API
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
