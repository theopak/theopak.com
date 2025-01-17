import { Shader } from 'react-shaders';
import fragmentShader from './brainsmoother.glsl';

const bgColor = [0, 0, 0, 1] as [number, number, number, number];

export function Visualizer() {
  return (
    <Shader
      clearColor={bgColor}
      devicePixelRatio={
        typeof window === 'undefined' ? undefined : window.devicePixelRatio
      }
      fs={fragmentShader}
    />
  );
}
