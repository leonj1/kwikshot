import { RecordingSettings } from '../stores/recordingStore';

export interface RecordingCapabilities {
  supportsDisplayMedia: boolean;
  supportsMediaRecorder: boolean;
  supportedMimeTypes: string[];
}

export class ScreenRecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private recordedChunks: Blob[] = [];
  private onDataAvailable?: (blob: Blob) => void;
  private onStop?: (blob: Blob) => void;
  private onError?: (error: Error) => void;

  /**
   * Get the preferred MIME type for recording (prioritizes MP4)
   */
  static getPreferredMimeType(): string | null {
    const capabilities = ScreenRecordingService.getCapabilities();

    // Prioritize MP4 formats
    const mp4Types = capabilities.supportedMimeTypes.filter(type => type.includes('mp4'));
    if (mp4Types.length > 0) {
      return mp4Types[0];
    }

    // Fallback to any supported format
    return capabilities.supportedMimeTypes[0] || null;
  }

  /**
   * Check if screen recording is supported in the current environment
   */
  static getCapabilities(): RecordingCapabilities {
    const supportsDisplayMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia);
    const supportsMediaRecorder = !!(window.MediaRecorder);
    
    const supportedMimeTypes: string[] = [];
    if (supportsMediaRecorder) {
      const mimeTypes = [
        'video/mp4;codecs=h264',
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
      ];
      
      mimeTypes.forEach(mimeType => {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          supportedMimeTypes.push(mimeType);
        }
      });
    }

    return {
      supportsDisplayMedia,
      supportsMediaRecorder,
      supportedMimeTypes,
    };
  }

  /**
   * Get display media stream with specified settings
   */
  async getDisplayMedia(settings: RecordingSettings): Promise<MediaStream> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      throw new Error('Screen recording is not supported in this browser');
    }

    const constraints: MediaStreamConstraints & { video: any } = {
      video: {
        width: this.getVideoConstraints(settings.quality).width,
        height: this.getVideoConstraints(settings.quality).height,
        frameRate: settings.frameRate,
      },
      audio: settings.includeSystemAudio,
    };

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
      // If microphone is requested, get user media and combine streams
      if (settings.includeMicrophone) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ 
            audio: true 
          });
          
          // Combine display and microphone audio
          const combinedStream = new MediaStream([
            ...displayStream.getVideoTracks(),
            ...displayStream.getAudioTracks(),
            ...audioStream.getAudioTracks(),
          ]);
          
          return combinedStream;
        } catch (audioError) {
          console.warn('Failed to get microphone access:', audioError);
          // Continue with just display stream
        }
      }
      
      return displayStream;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Screen recording permission was denied');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No screen sources available');
        } else if (error.name === 'NotSupportedError') {
          throw new Error('Screen recording is not supported');
        }
      }
      throw new Error(`Failed to get display media: ${error}`);
    }
  }

  /**
   * Start recording with the given media stream
   */
  async startRecording(
    mediaStream: MediaStream,
    settings: RecordingSettings,
    callbacks: {
      onDataAvailable?: (blob: Blob) => void;
      onStop?: (blob: Blob) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      throw new Error('Recording is already in progress');
    }

    this.onDataAvailable = callbacks.onDataAvailable;
    this.onStop = callbacks.onStop;
    this.onError = callbacks.onError;

    const capabilities = ScreenRecordingService.getCapabilities();
    if (capabilities.supportedMimeTypes.length === 0) {
      throw new Error('No supported video formats available');
    }

    // Use preferred MIME type (prioritizes MP4)
    const mimeType = ScreenRecordingService.getPreferredMimeType() || capabilities.supportedMimeTypes[0];
    const options: MediaRecorderOptions = {
      mimeType,
      videoBitsPerSecond: this.getVideoBitrate(settings.quality),
    };

    try {
      this.mediaStream = mediaStream;
      this.mediaRecorder = new MediaRecorder(mediaStream, options);
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
          this.onDataAvailable?.(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        this.onStop?.(blob);
      };

      this.mediaRecorder.onerror = (event) => {
        const error = new Error(`MediaRecorder error: ${event}`);
        this.onError?.(error);
      };

      // Handle stream ending (user stops sharing)
      mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.stopRecording();
        }
      });

      this.mediaRecorder.start(1000); // Collect data every second
    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  /**
   * Pause the current recording
   */
  pauseRecording(): void {
    if (!this.mediaRecorder) {
      throw new Error('No active recording to pause');
    }

    if (this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  /**
   * Resume the paused recording
   */
  resumeRecording(): void {
    if (!this.mediaRecorder) {
      throw new Error('No active recording to resume');
    }

    if (this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  /**
   * Stop the current recording
   */
  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  /**
   * Get the current recording state
   */
  getRecordingState(): RecordingState | null {
    return this.mediaRecorder?.state || null;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.stopRecording();
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.onDataAvailable = undefined;
    this.onStop = undefined;
    this.onError = undefined;
  }

  private getVideoConstraints(quality: string) {
    switch (quality) {
      case '720p':
        return { width: 1280, height: 720 };
      case '1080p':
        return { width: 1920, height: 1080 };
      case '1440p':
        return { width: 2560, height: 1440 };
      case '4k':
        return { width: 3840, height: 2160 };
      default:
        return { width: 1920, height: 1080 };
    }
  }

  private getVideoBitrate(quality: string): number {
    switch (quality) {
      case '720p':
        return 2500000; // 2.5 Mbps
      case '1080p':
        return 5000000; // 5 Mbps
      case '1440p':
        return 8000000; // 8 Mbps
      case '4k':
        return 15000000; // 15 Mbps
      default:
        return 5000000;
    }
  }
}

export type RecordingState = 'inactive' | 'recording' | 'paused';
