import React, { useRef, useEffect, useState } from 'react'
import { VideoStreamer } from '@/core/VideoStreamer'
import type { VideoStream, VideoError } from '@/types/video'
import styles from './VideoFeed.module.css'

interface VideoFeedProps {
  width?: number
  height?: number
  frameRate?: number
  onStreamReady?: (
    videoElement: HTMLVideoElement,
    streamer: VideoStreamer
  ) => void
  onError?: (error: VideoError) => void
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  width = 640,
  height = 480,
  frameRate = 30,
  onStreamReady,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamerRef = useRef<VideoStreamer | null>(null)
  const [stream, setStream] = useState<VideoStream | null>(null)
  const [error, setError] = useState<VideoError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initializeCamera = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const streamer = new VideoStreamer({
          width,
          height,
          frameRate,
        })

        streamerRef.current = streamer
        const videoStream = await streamer.initialize()

        if (videoRef.current && videoStream.stream) {
          videoRef.current.srcObject = videoStream.stream
          setStream(videoStream)

          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && streamerRef.current) {
              onStreamReady?.(videoRef.current, streamerRef.current)
            }
          }
        }
      } catch (err) {
        const videoError = err as VideoError
        setError(videoError)
        onError?.(videoError)
      } finally {
        setIsLoading(false)
      }
    }

    initializeCamera()

    return () => {
      if (streamerRef.current) {
        streamerRef.current.cleanup()
      }
    }
  }, [width, height, frameRate, onStreamReady, onError])

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Initializing camera...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>Camera Error</h3>
          <p>{error.message}</p>
          {error.type === 'permission' && (
            <p>
              <small>
                Please refresh the page and allow camera access when prompted.
              </small>
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={styles.video}
        width={width}
        height={height}
      />
      <div className={styles.status}>
        Status:{' '}
        <span className={stream?.isActive ? styles.active : styles.inactive}>
          {stream?.isActive ? 'Active' : 'Inactive'}
        </span>
        {stream?.isActive && <span> • {stream.frameRate} FPS</span>}
      </div>
    </div>
  )
}
