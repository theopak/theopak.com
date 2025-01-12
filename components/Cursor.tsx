import { useUpdateMyPresence } from '@liveblocks/react/suspense';
import { useRef, useEffect } from 'react';

export function Cursor({
  color = 'red',
  x,
  y,
}: {
  color?: string;
  x?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const updateMyPresence = useUpdateMyPresence();
  const isMe = typeof x === 'undefined' && typeof y === 'undefined';

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const clientX = Math.round(event.clientX);
      const clientY = Math.round(event.clientY);
      updateMyPresence({ cursor: { x: clientX, y: clientY } });
    };

    const onPointerLeave = () => {
      updateMyPresence({ cursor: null });
    };

    if (isMe) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerleave', onPointerLeave);
    }
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [isMe, updateMyPresence]);

  return (
    <div
      ref={ref}
      className="cursor"
      style={
        isMe
          ? undefined
          : { transform: `translate(${x}px, ${y}px)`, visibility: 'visible' }
      }
    >
      <svg
        width="12"
        height="16"
        viewBox="0 0 14 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          stroke={isMe ? 'transparent' : color}
          fill={isMe ? color : 'transparent'}
        />
      </svg>
      {`${'\xA0'}Anonymous live user`}
    </div>
  );
}
