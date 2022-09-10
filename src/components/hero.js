import React from 'react'
import styled from 'styled-components'
import Video from '../assets/mp4-h264-aac-1920_1080.mp4'

const Hero = () => {
  return (
    <HeroContainer>
        <HeroBg>
            <VideoBg src={Video} type="video/mp4" autoPlay loop muted playsInline />
        </HeroBg>

    </HeroContainer>
  )
}

export default Hero

const HeroContainer = styled.div`
background: #0c0c0c;
display:flex
justify-content: center;
color: #fff;
height: 100vh;`
const HeroBg = styled.div`
position: absolute;
top: 0;
bottom: 0;
right: 0;
left: 0;
width: 100%
height: 100%;
overflow: hidden;`
const VideoBg = styled.video`
width: 100%;
height: 100%;
-o-object-fit: cover;
object-fit: cover;
z-index: 1;`

const HeroContent = styled.div`
`