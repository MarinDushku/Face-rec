import React from 'react'
import styles from './Controls.module.css'

interface ControlsProps {
  isActive: boolean
  onStart: () => void
  onStop: () => void
  disabled?: boolean
}

export const Controls: React.FC<ControlsProps> = ({
  isActive,
  onStart,
  onStop,
  disabled = false,
}) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${styles.startButton}`}
        onClick={onStart}
        disabled={disabled || isActive}
      >
        Start Camera
      </button>

      <button
        className={`${styles.button} ${styles.stopButton}`}
        onClick={onStop}
        disabled={disabled || !isActive}
      >
        Stop Camera
      </button>

      <div className={styles.info}>
        <span>Camera:</span>
        <span
          className={`${styles.status} ${
            isActive ? styles.statusActive : styles.statusInactive
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  )
}
