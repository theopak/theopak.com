'use client';

import type { ReactNode } from 'react';
import { use } from 'react';
import type { Grid, Props as RndProps } from 'react-rnd';
import { Rnd } from 'react-rnd';
import Scrollbar from 'react-scrollbars-custom';
import { WindowContext } from './WindowContext';
import { getFormattedTime } from './getFormattedTime';

const DRAG_GRID = [16, 16] as Grid;

type Props = {
  children?: ReactNode | (() => ReactNode) | null;
  date?: Date | null;
  id: string;
  isPrimary?: boolean | null;
  title?: string | null;
} & Omit<RndProps, 'default'>;

export function Window({
  children,
  date,
  html,
  id,
  isPrimary,
  title,
  ...rest
}: Props) {
  const { setOpen, updateWindow } = use(WindowContext);
  const elementId = `title-${id}`;

  return (
    <Rnd
      resizeGrid={DRAG_GRID}
      className="flex flex-col bg-gray-900 border border-white overflow-hidden font-sans window"
      dragHandleClassName="cursor-move"
      maxWidth={880}
      minHeight={200}
      minWidth={200}
      onMouseDown={isPrimary ? undefined : () => setOpen(id)}
      onDragStop={(__event, data) =>
        updateWindow(id, {
          position: {
            x: data.x,
            y: data.y,
          },
        })
      }
      onResizeStop={(__event, __dir, refToElement) =>
        updateWindow(id, {
          size: {
            height: parseInt(refToElement?.style?.height, 10),
            width: parseInt(refToElement?.style?.width, 10),
          },
        })
      }
      style={{
        display: 'flex', // HACK: override rnd to match assigned className `flex`
        boxShadow: isPrimary ? undefined : 'none',
        opacity: isPrimary ? undefined : 0.4,
      }}
      {...rest}
    >
      <article
        className="flex-grow flex flex-col h-full overflow-hidden"
        role={isPrimary ? 'main' : undefined}
        aria-labelledby={elementId}
      >
        <h1
          id={elementId}
          className="border-b border-white flex-grow-0 p-2 text-center font-mono font-extrabold truncate cursor-move"
        >
          {title}
        </h1>
        {isPrimary && (
          <Scrollbar
            className="flex-grow"
            disableTracksWidthCompensation={true}
            noDefaultStyles={true}
            removeTrackXWhenNotUsed={true}
            // permanentTrackX={true}
            scrollbarWidth={8}
          >
            <div className="flex-grow flex flex-col space-between px-4 py-2 space-y-2 leading-relaxed window--content">
              {typeof children === 'function' ? children() : children}
              <div
                className="flex-grow space-y-2 leading-relaxed overflow-hidden"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              {date && (
                <div className="w-full py-2 pt-8 overflow-y-hidden">
                  <div className="font-mono text-xs text-gray-400 overflow-hidden text-nowrap">
                    <span className="select-none">{`░░ `}</span>
                    {`PUBLISHED ${getFormattedTime(date, false)}`}
                    <span className="select-none">
                      {` ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Scrollbar>
        )}
      </article>
    </Rnd>
  );
}
