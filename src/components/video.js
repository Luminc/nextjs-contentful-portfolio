import React from "react";
import styled from "styled-components";
const Video = ({ Src, Title, muted, ...props }) => (
  <div className="video">
    <VideoBg
      src={Src}
      type="video/mp4"
      autoPlay
      loop
      playsInline
      controls
      className="video-internal"
    />
  </div>
);
export default Video;

const VideoBg = styled.video`
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
  z-index: 1;
`;
