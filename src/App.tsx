import { useState, useCallback } from 'react'
import { VideoFeed } from '@/components/VideoFeed/VideoFeed'
import { Controls } from '@/components/Controls/Controls'
import { VideoStreamer } from '@/core/VideoStreamer'
import type { VideoError } from '@/types/video'
import './App.css'

function App() {
  const [isStreamActive, setIsStreamActive] = useState(false)
  const [currentStreamer, setCurrentStreamer] = useState<VideoStreamer | null>(
    null
  )
  const [error, setError] = useState<VideoError | null>(null)
  const [key, setKey] = useState(0) // Force remount of VideoFeed

  const handleStreamReady = useCallback(
    (_videoElement: HTMLVideoElement, streamer: VideoStreamer) => {
      setCurrentStreamer(streamer)
      setIsStreamActive(true)
      setError(null)
    },
    []
  )

  const handleError = useCallback((error: VideoError) => {
    setError(error)
    setIsStreamActive(false)
    setCurrentStreamer(null)
  }, [])

  const handleStart = useCallback(() => {
    setError(null)
    setKey((prev) => prev + 1) // Force remount to reinitialize
  }, [])

  const handleStop = useCallback(() => {
    if (currentStreamer) {
      currentStreamer.cleanup()
      setCurrentStreamer(null)
    }
    setIsStreamActive(false)
    setKey((prev) => prev + 1) // Force remount to cleanup
  }, [currentStreamer])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Face Recognition System</h1>
        <p>Custom face detection and recognition module</p>

        <div className="video-section">
          <VideoFeed
            key={key}
            width={640}
            height={480}
            frameRate={30}
            onStreamReady={handleStreamReady}
            onError={handleError}
          />

          <Controls
            isActive={isStreamActive}
            onStart={handleStart}
            onStop={handleStop}
            disabled={false}
          />

          {error && (
            <div className="error-info">
              <h3>Error Details</h3>
              <p>
                <strong>Code:</strong> {error.code}
              </p>
              <p>
                <strong>Type:</strong> {error.type}
              </p>
              <p>
                <strong>Message:</strong> {error.message}
              </p>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

export default App
