import React from "react"
const Video = ({ Src, Title, ...props }) => (
  <div className="video">
    <iframe
      src={Src}
      title={Title}
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
    />
  </div>
)
export default Video