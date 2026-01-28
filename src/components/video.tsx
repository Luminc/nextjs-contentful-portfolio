'use client'

import styles from './video.module.scss'

interface VideoProps {
  Src: string
  Title?: string
  muted?: boolean
  [key: string]: any
}

const Video: React.FC<VideoProps> = ({ Src, Title, muted, ...props }) => (
  <div className="video">
    <video
      src={Src}
      title={Title}
      autoPlay
      loop
      playsInline
      controls
      muted={muted}
      className={styles.videoBg}
      {...props}
    />
  </div>
)

export default Video