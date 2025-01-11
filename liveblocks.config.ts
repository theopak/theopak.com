declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
    };
  }
}

export {};
