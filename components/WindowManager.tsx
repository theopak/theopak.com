"use client";

import { WindowContext } from "./WindowContext";
import { Window } from "./Window";
import { contentByPid } from "./contentByPid";
import { use } from "react";

type Props = {
  primaryPost?: { id: string; date: Date; html: string; title: string };
};

export function WindowManager({ primaryPost }: Props) {
  const { openWindows } = use(WindowContext);
  const postsToRender = primaryPost
    ? [...openWindows.entries()].slice(0, -1)
    : [...openWindows.entries()];

  return (
    <>
      {postsToRender.map(([id, value], i) => {
        const isClientSidePrimary = i === openWindows.size - 1;
        const other = isClientSidePrimary ? primaryPost : {};
        return (
          <Window
            key={id}
            {...value}
            title={contentByPid[id]?.title}
            {...other}
            isPrimary={isClientSidePrimary}
          >
            {isClientSidePrimary ? null : contentByPid[id]?.children}
          </Window>
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
