import { Shader } from 'react-shaders';
import fragmentShader from './eyebleed.glsl';

export function Visualizer() {
  return (
    <Shader
      devicePixelRatio={
        typeof window === 'undefined' ? undefined : window.devicePixelRatio
      }
      fs={fragmentShader}
    />
  );
}
