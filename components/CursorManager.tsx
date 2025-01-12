'use client';

import { useOthers } from '@liveblocks/react';
import { Cursor } from './Cursor';

const COLORS = [
  '#E57373',
  '#9575CD',
  '#4FC3F7',
  '#81C784',
  '#FFF176',
  '#FF8A65',
  '#F06292',
  '#7986CB',
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
