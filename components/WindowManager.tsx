'use client';

import { use } from 'react';
import type { getAllPostsMetadata } from '../lib/api';
import { WindowContext } from './WindowContext';
import { Window } from './Window';

type Props = {
  posts?: Awaited<ReturnType<typeof getAllPostsMetadata>> | null;
  primaryPost?: { id: string; date: Date; html: string; title: string };
};

export function WindowManager({ posts, primaryPost }: Props) {
  const { openWindows } = use(WindowContext);
  const postsToRender = [...openWindows.entries()].filter(
    ([id]) => !primaryPost || id !== primaryPost.id,
  );

  return (
    <>
      {postsToRender.map(([id, value], i) => {
        const isClientSidePrimary = i === openWindows.size - 1;
        const other = isClientSidePrimary ? primaryPost : {};
        return (
          <Window
            key={id}
            {...value}
            {...other}
            title={posts?.[id]?.title}
            isPrimary={isClientSidePrimary}
          />
        );
      })}
      {primaryPost && (
        <Window
          isPrimary={true}
          {...openWindows.get(primaryPost.id)}
          {...primaryPost}
        />
      )}
    </>
  );
}
