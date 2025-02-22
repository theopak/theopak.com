'use client';

import { useOthers } from '@liveblocks/react';
import { Cursor } from './Cursor';

const COLORS = [
  'rgb(89.8% 45.1% 45.1%)',
  'rgb(58.4% 45.9% 80.4%)',
  'rgb(30.6% 76.5% 96.9%)',
  'rgb(50.0% 78.0% 51.8%)',
  'rgb(100% 94.5% 46.3%)',
  'rgb(100% 54.1% 39.6%)',
  'rgb(94.1% 38.4% 57.3%)',
  'rgb(47.5% 52.5% 79.6%)',
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
            x={presence.cursor?.x}
            y={presence.cursor?.y}
          />
        ))}
      <Cursor />
    </>
  );
}
