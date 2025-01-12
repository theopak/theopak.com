'use client';

import React from 'react';
import { LiveblocksProvider, RoomProvider } from '@liveblocks/react';
import Asdf from './Asdf';
import CursorManager from './CursorManager';

export default function Home(props) {
  return (
    <LiveblocksProvider
      publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}
      throttle={16}
    >
      <RoomProvider
        autoConnect={false} // HACK: quota exceeded
        id="theo"
        initialPresence={{ cursor: null }}
      >
        <Asdf {...props} />
        <CursorManager />
      </RoomProvider>
    </LiveblocksProvider>
  );
}
