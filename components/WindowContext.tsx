'use client';

import { useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Position, ResizableDelta, Props as RndProps } from 'react-rnd';

type WindowState = { id: string } & Required<
  Pick<RndProps, 'position' | 'size'>
>;

type OpenWindows = Map<string, WindowState>;

type UpdateWindowData = { position: Position } | { size: ResizableDelta };

export const WindowContext = createContext({
  openWindows: {} as OpenWindows,
  setClosed: (__id: string) => {},
  setOpen: (__id: string) => {},
  updateWindow: (__id: string, __data: UpdateWindowData) => {},
});

export function getPostId() {
  return typeof window === 'undefined'
    ? undefined
    : window.location.pathname.match(/\/posts\/([\w-_]+)(\?)?/i)?.[1];
}

export function getDefaultValues(lastValue?: WindowState) {
  const result = {
    position: {
      x: (lastValue?.position?.x || 0) + 16 * 1.5,
      y: (lastValue?.position?.y || window.scrollY) + 16 * 1.5,
    },
    size: {
      height: 0,
      width: 0,
    },
  };
  if (result.position.x + 100 >= window.innerWidth) {
    result.position.x = 16 * 1 * 1.5;
  }
  if (result.position.y + 100 >= window.innerHeight) {
    result.position.y = 16 * 3 * 1.5;
  }
  result.size = {
    height: Math.min(900, window.innerHeight - result.position.y - 16 * 1.5),
    width: Math.min(720, window.innerWidth - result.position.x - 16 * 1.5),
  };
  return result;
}

function readUrlState() {
  const url =
    typeof window === 'undefined' ? undefined : new URL(window.location.href);
  const postId = getPostId();
  const state: OpenWindows = new Map();
  url?.searchParams
    ?.entries()
    ?.forEach?.(([key, value]) => state.set(key, JSON.parse(value)));
  if (postId) {
    state.delete(postId);
    state.set(postId, { ...getDefaultValues(), id: postId });
  }
  // console.log([...state.values()]);
  return state;
}

type Props = PropsWithChildren<{
  initialState?: OpenWindows;
}>;

export function WindowContextProvider({
  children,
  initialState = readUrlState(),
}: Props) {
  const [openWindows, setOpenWindows] = useState<OpenWindows>(initialState);
  const { push } = useRouter();

  const replaceUrlState = useCallback(
    (state: OpenWindows) => {
      const stateAsSearchParams = new URLSearchParams();
      let lastId = '';
      state.forEach((value, key) => {
        stateAsSearchParams.set(key, JSON.stringify(value));
        lastId = key;
      });
      const url = new URL(window.location.href);
      url.pathname = `/posts/${lastId}`;
      url.search = stateAsSearchParams.toString();
      if (lastId === getPostId()) {
        window.history.replaceState(null, '', url);
      } else {
        setTimeout(() => push(url.toString()), 0);
      }
    },
    [push],
  );

  const setClosed = useCallback(
    (id: string) =>
      setOpenWindows((prev) => {
        const next = new Map(prev);
        next.delete(id);
        replaceUrlState(next);
        return next;
      }),
    [replaceUrlState],
  );

  const setOpen = useCallback(
    (id: string) =>
      setOpenWindows((prev) => {
        const origValueForId = prev.get(id);
        const lastValue = [...prev.values()].at(-1);
        const next = new Map(prev);
        if (origValueForId) {
          next.delete(id);
          next.set(id, origValueForId);
        } else {
          next.set(id, { ...getDefaultValues(lastValue), id });
        }
        replaceUrlState(next);
        return next;
      }),
    [replaceUrlState],
  );

  const updateWindow = useCallback(
    (id: string, data: UpdateWindowData) =>
      setOpenWindows((prev) => {
        const next = new Map(prev);
        const updates: Partial<WindowState> = { id };
        if ('size' in data) {
          updates.size = data.size;
        }
        if ('position' in data) {
          updates.position = data.position;
        }
        // @ts-expect-error TODO: fix types
        next.set(id, { ...prev.get(id), ...updates });
        replaceUrlState(next);
        return next;
      }),
    [replaceUrlState],
  );

  const value = useMemo(
    () => ({ openWindows, setClosed, setOpen, updateWindow }),
    [openWindows, setClosed, setOpen, updateWindow],
  );

  useEffect(() => {
    const onPopState = () => setOpenWindows(readUrlState());
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  return <WindowContext value={value}>{children}</WindowContext>;
}
