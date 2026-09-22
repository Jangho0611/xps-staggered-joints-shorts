import React from 'react';
import {AbsoluteFill, Audio, Freeze, staticFile, useCurrentFrame} from 'remotion';
import {Scene5Ending} from './scene5/Scene5Ending';

// Copied connection behavior of the approved final: 170 frames at 30fps.
// Inner artwork runs at the original 24fps timing; never rescale its keyframes.
export const Ending = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>
    <Freeze frame={Math.min(135, Math.floor(frame * 24 / 30))}><Scene5Ending/></Freeze>
    <Audio src={staticFile('assets/audio/scene06-tts-v3.mp3')}/>
  </AbsoluteFill>;
};
