import { ElectronAPI } from '../../preload/index';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
  
  namespace Electron {
    interface DesktopCapturerSource {
      id: string;
      name: string;
      thumbnail: NativeImage;
      display_id?: string;
      appIcon?: NativeImage;
    }
    
    interface NativeImage {
      toPNG(): Buffer;
      toJPEG(quality: number): Buffer;
      toBitmap(): Buffer;
      toDataURL(): string;
      getBitmap(): Buffer;
      getNativeHandle(): Buffer;
      isEmpty(): boolean;
      getSize(): { width: number; height: number };
      setTemplateImage(option: boolean): void;
      isTemplateImage(): boolean;
      crop(rect: { x: number; y: number; width: number; height: number }): NativeImage;
      resize(options: { width?: number; height?: number; quality?: 'good' | 'better' | 'best' }): NativeImage;
      getAspectRatio(): number;
      addRepresentation(options: { scaleFactor: number; width?: number; height?: number; buffer?: Buffer; dataURL?: string }): void;
    }
  }
}

export {};
