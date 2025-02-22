'use client';

import { useMyPresence, useOthers } from '@liveblocks/react';
import { Shader } from 'react-shaders';
import fragmentShader from './brainsmoother.glsl';
import { useEffect, useRef } from 'react';

const bgColor = [0, 0, 0, 1] as [number, number, number, number];

export function Visualizer() {
  const [myPresence] = useMyPresence();
  const others = useOthers();
  const cursors = useRef<Array<number>>(new Array(100).fill(-666));

  useEffect(() => {
    cursors.current[0] = others.length ? myPresence.cursor?.x || -666 : -666;
    cursors.current[1] = others.length ? myPresence.cursor?.y || -666 : -666;
    for (let i = 0; i < others.length; i += 2) {
      const index = i + 2;
      if (others[i].presence?.cursor) {
        cursors.current[index] = others[i].presence.cursor.x;
        cursors.current[index + 1] = others[i].presence.cursor.y;
      } else {
        cursors.current[index] = -100;
        cursors.current[index + 1] = -100;
      }
    }
  }, [myPresence.cursor, others]);

  const uniforms = {
    uCursorsCount: { type: '1i', value: cursors.current.length / 2 },
    uCursors: { type: '1fv', value: cursors.current },
  };
  // console.log(JSON.stringify(uniforms));

  return (
    <Shader
      clearColor={bgColor}
      devicePixelRatio={
        typeof window === 'undefined' ? undefined : window.devicePixelRatio
      }
      fs={fragmentShader}
      uniforms={uniforms}
    />
  );
}
