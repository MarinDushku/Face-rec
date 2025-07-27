import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { VideoStreamer } from '@/core/VideoStreamer'

// Mock MediaDevices
const mockGetUserMedia = vi.fn()
const mockTrack = {
  stop: vi.fn(),
}
const mockStream = {
  getTracks: vi.fn(() => [mockTrack]),
}

Object.defineProperty(globalThis, 'navigator', {
  value: {
    mediaDevices: {
      getUserMedia: mockGetUserMedia,
    },
  },
  writable: true,
})

// Mock HTMLCanvasElement and CanvasRenderingContext2D
const mockContext = {
  drawImage: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(640 * 480 * 4),
    width: 640,
    height: 480,
  })),
}

const mockCanvas = {
  getContext: vi.fn(() => mockContext),
  width: 0,
  height: 0,
}

Object.defineProperty(globalThis, 'document', {
  value: {
    createElement: vi.fn(() => mockCanvas),
  },
  writable: true,
})

describe('VideoStreamer', () => {
  let videoStreamer: VideoStreamer

  beforeEach(() => {
    videoStreamer = new VideoStreamer({
      width: 640,
      height: 480,
      frameRate: 30,
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    videoStreamer.cleanup()
  })

  describe('initialize', () => {
    it('should successfully initialize video stream', async () => {
      mockGetUserMedia.mockResolvedValue(mockStream)

      const result = await videoStreamer.initialize()

      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
          facingMode: 'user',
        },
        audio: false,
      })

      expect(result).toEqual({
        stream: mockStream,
        isActive: true,
        frameRate: 30,
      })
    })

    it('should handle permission denied error', async () => {
      const permissionError = new Error('Permission denied')
      mockGetUserMedia.mockRejectedValue(permissionError)

      await expect(videoStreamer.initialize()).rejects.toEqual({
        code: 'PERMISSION_DENIED',
        message:
          'Camera access denied. Please grant permission to use the camera.',
        type: 'permission',
      })
    })

    it('should handle device not found error', async () => {
      const deviceError = new Error('Device not found')
      mockGetUserMedia.mockRejectedValue(deviceError)

      await expect(videoStreamer.initialize()).rejects.toEqual({
        code: 'DEVICE_NOT_FOUND',
        message: 'No camera device found. Please ensure a camera is connected.',
        type: 'device',
      })
    })

    it('should handle unknown errors', async () => {
      const unknownError = new Error('Some unknown error')
      mockGetUserMedia.mockRejectedValue(unknownError)

      await expect(videoStreamer.initialize()).rejects.toEqual({
        code: 'UNKNOWN_ERROR',
        message: 'Video initialization failed: Some unknown error',
        type: 'unknown',
      })
    })
  })

  describe('captureFrame', () => {
    const mockVideoElement = {
      videoWidth: 640,
      videoHeight: 480,
    } as HTMLVideoElement

    it('should return null when not initialized', () => {
      const result = videoStreamer.captureFrame(mockVideoElement)
      expect(result).toBeNull()
    })

    it('should capture frame when initialized', async () => {
      mockGetUserMedia.mockResolvedValue(mockStream)
      await videoStreamer.initialize()

      const result = videoStreamer.captureFrame(mockVideoElement)

      expect(mockContext.drawImage).toHaveBeenCalledWith(
        mockVideoElement,
        0,
        0,
        640,
        480
      )
      expect(mockContext.getImageData).toHaveBeenCalledWith(0, 0, 640, 480)
      expect(result).toBeDefined()
      expect(result?.width).toBe(640)
      expect(result?.height).toBe(480)
    })
  })

  describe('cleanup', () => {
    it('should stop all tracks and reset state', async () => {
      mockGetUserMedia.mockResolvedValue(mockStream)
      await videoStreamer.initialize()

      videoStreamer.cleanup()

      expect(mockTrack.stop).toHaveBeenCalled()
      expect(videoStreamer.isActive()).toBe(false)
      expect(videoStreamer.getStream()).toBeNull()
    })
  })

  describe('getStream and isActive', () => {
    it('should return correct stream state', async () => {
      expect(videoStreamer.isActive()).toBe(false)
      expect(videoStreamer.getStream()).toBeNull()

      mockGetUserMedia.mockResolvedValue(mockStream)
      await videoStreamer.initialize()

      expect(videoStreamer.isActive()).toBe(true)
      expect(videoStreamer.getStream()).toBe(mockStream)
    })
  })
})
