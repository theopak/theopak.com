import { Shader } from 'react-shaders';
import fragmentShader from './eyebleed.glsl';

const bgColor = [0.28, 0.28, 0.29, 1.0] as [number, number, number, number];

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
