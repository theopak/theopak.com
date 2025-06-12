'use client';

import { useOthers } from '@liveblocks/react';
import { Cursor } from './Cursor';

const COLORS = [
  'rgb( 58.4% 45.9% 80.4%)', // purple
  'rgb( 30.6% 76.5% 96.9%)', // light blue
  'rgb( 89.8% 45.1% 45.1%)', // red
  'rgb( 50.0% 78.0% 51.8%)', // green
  'rgb(100.0% 94.5% 46.3%)', // yellow
  'rgb(100.0% 54.1% 39.6%)', // orange
  'rgb( 94.1% 38.4% 57.3%)', // pink
  'rgb( 47.5% 52.5% 79.6%)', // blue
] as const;

export default function CursorManager() {
  const others = useOthers();

  return (
    <>
      {others
        .filter((other) => other.presence.cursor !== null)
        .map(({ connectionId, presence }) => (
          <Cursor
            key={`cursor-${connectionId}`}
            color={COLORS[connectionId % COLORS.length]}
            x={
              presence.cursor && typeof presence.cursor === 'object'
                ? (presence.cursor as { x: number }).x
                : 0
            }
            y={
              presence.cursor && typeof presence.cursor === 'object'
                ? (presence.cursor as { y: number }).y
                : 0
            }
          />
        ))}
      <Cursor />
    </>
  );
}
