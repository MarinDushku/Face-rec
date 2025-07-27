export interface VideoStream {
  stream: MediaStream | null
  isActive: boolean
  frameRate: number
}

export interface VideoStreamerConfig {
  width: number
  height: number
  frameRate: number
  facingMode?: 'user' | 'environment'
}

export interface CameraDevice {
  deviceId: string
  label: string
  kind: MediaDeviceKind
}

export interface VideoError {
  code: string
  message: string
  type: 'permission' | 'device' | 'unknown'
}
