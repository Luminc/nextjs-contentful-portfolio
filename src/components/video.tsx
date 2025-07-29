'use client'

import styled from 'styled-components'

interface VideoProps {
  Src: string
  Title?: string
  muted?: boolean
  [key: string]: any
}

const VideoBg = styled.video<{
  src: string
  title?: string
  autoPlay: boolean
  loop: boolean
  playsInline: boolean
  controls: boolean
  muted?: boolean
  className: string
}>`
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  z-index: 1;
`

const Video: React.FC<VideoProps> = ({ Src, Title, muted, ...props }) => (
  <div className="video">
    <VideoBg
      src={Src}
      title={Title}
      autoPlay
      loop
      playsInline
      controls
      muted={muted}
      className="video-internal"
      {...props}
    />
  </div>
)

export default Video