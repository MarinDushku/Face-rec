import type {
  VideoStream,
  VideoStreamerConfig,
  VideoError,
} from '@/types/video'

export class VideoStreamer {
  private stream: MediaStream | null = null
  private canvas: HTMLCanvasElement | null = null
  private context: CanvasRenderingContext2D | null = null
  private config: VideoStreamerConfig
  private isInitialized = false

  constructor(config: VideoStreamerConfig) {
    this.config = config
  }

  async initialize(): Promise<VideoStream> {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: this.config.width },
          height: { ideal: this.config.height },
          frameRate: { ideal: this.config.frameRate },
          facingMode: this.config.facingMode || 'user',
        },
        audio: false,
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.isInitialized = true

      return {
        stream: this.stream,
        isActive: true,
        frameRate: this.config.frameRate,
      }
    } catch (error) {
      const videoError = this.mapError(error as Error)
      throw videoError
    }
  }

  captureFrame(videoElement: HTMLVideoElement): ImageData | null {
    if (!this.isInitialized || !this.stream) {
      return null
    }

    if (!this.canvas) {
      this.canvas = document.createElement('canvas')
      this.canvas.width = this.config.width
      this.canvas.height = this.config.height
      this.context = this.canvas.getContext('2d')
    }

    if (!this.context) {
      return null
    }

    this.context.drawImage(
      videoElement,
      0,
      0,
      this.config.width,
      this.config.height
    )

    return this.context.getImageData(
      0,
      0,
      this.config.width,
      this.config.height
    )
  }

  cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }
    this.isInitialized = false
    this.canvas = null
    this.context = null
  }

  getStream(): MediaStream | null {
    return this.stream
  }

  isActive(): boolean {
    return this.isInitialized && this.stream !== null
  }

  private mapError(error: Error): VideoError {
    const message = error.message.toLowerCase()

    if (message.includes('permission') || message.includes('denied')) {
      return {
        code: 'PERMISSION_DENIED',
        message:
          'Camera access denied. Please grant permission to use the camera.',
        type: 'permission',
      }
    }

    if (message.includes('device') || message.includes('notfound')) {
      return {
        code: 'DEVICE_NOT_FOUND',
        message: 'No camera device found. Please ensure a camera is connected.',
        type: 'device',
      }
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: `Video initialization failed: ${error.message}`,
      type: 'unknown',
    }
  }
}
