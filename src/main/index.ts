import { app, BrowserWindow, ipcMain, desktopCapturer, systemPreferences } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import * as isDev from 'electron-is-dev';

class KwikShotApp {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    // Handle app ready
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupIpcHandlers();
      this.requestPermissions();
      
      if (!isDev) {
        autoUpdater.checkForUpdatesAndNotify();
      }
    });

    // Handle window closed
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Handle app activate (macOS)
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      titleBarStyle: 'hiddenInset',
      backgroundColor: '#0f172a',
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        allowRunningInsecureContent: false,
        preload: path.join(__dirname, '../preload/index.js'),
      },
    });

    // Load the app
    if (isDev) {
      const devPort = process.env.DEV_PORT || process.env.PORT || '3000';
      const devHost = process.env.DEV_HOST || 'localhost';
      this.mainWindow.loadURL(`http://${devHost}:${devPort}`);
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    // Show window when ready
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // Handle window closed
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private async requestPermissions(): Promise<void> {
    // Request screen recording permission on macOS
    if (process.platform === 'darwin') {
      const cameraStatus = systemPreferences.getMediaAccessStatus('camera');
      const micStatus = systemPreferences.getMediaAccessStatus('microphone');

      if (cameraStatus !== 'granted') {
        await systemPreferences.askForMediaAccess('camera');
      }
      if (micStatus !== 'granted') {
        await systemPreferences.askForMediaAccess('microphone');
      }
    }
  }

  private setupIpcHandlers(): void {
    // Get available screens for recording
    ipcMain.handle('get-sources', async () => {
      try {
        const sources = await desktopCapturer.getSources({
          types: ['window', 'screen'],
          thumbnailSize: { width: 150, height: 150 }
        });
        return sources;
      } catch (error) {
        console.error('Error getting sources:', error);
        return [];
      }
    });

    // Get user media devices
    ipcMain.handle('get-media-devices', async () => {
      try {
        // This will be handled in the renderer process
        return { success: true };
      } catch (error) {
        console.error('Error getting media devices:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    // Handle app quit
    ipcMain.handle('quit-app', () => {
      app.quit();
    });

    // Handle minimize window
    ipcMain.handle('minimize-window', () => {
      this.mainWindow?.minimize();
    });

    // Handle maximize window
    ipcMain.handle('maximize-window', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });
  }
}

// Initialize the app
new KwikShotApp();
