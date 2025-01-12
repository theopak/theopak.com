'use client';

import { use, useState, type ReactNode } from 'react';
import { Rnd } from 'react-rnd';
import type { Grid, Props as RndProps } from 'react-rnd';
import { WindowContext } from './WindowContext';
import { getFormattedTime } from './getFormattedTime';
import Scrollbar from 'react-scrollbars-custom';

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
  const [z, setZ] = useState(1);
  const elementId = `title-${id}`;

  return (
    <Rnd
      resizeGrid={DRAG_GRID}
      className="bg-gray-900 border border-white overflow-hidden font-sans"
      dragHandleClassName="cursor-move"
      maxWidth={880}
      minHeight={200}
      minWidth={200}
      onMouseDown={isPrimary ? undefined : () => setOpen(id)}
      onMouseUp={() => {
        // TODO: fix this
        // event.target.style.zIndex = 1;
        setZ(1);
      }}
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
        boxShadow: isPrimary ? undefined : 'none',
        opacity: isPrimary ? undefined : 0.4,
        zIndex: z,
      }}
      {...rest}
    >
      <div
        className="flex flex-col h-full overflow-hidden"
        role={isPrimary ? 'main' : undefined}
        aria-labelledby={elementId}
      >
        <div className="text-bold flex justify-between">
          <h1
            id={elementId}
            className="border-b border-white grow p-2 text-center font-mono font-extrabold truncate cursor-move"
          >
            {title}
          </h1>
          {/*<Tooltip>
              <TooltipTrigger>
                <span className="border-white border-b border-l p-1 w-7 h-7 hover:bg-[#dfdfdf] hover:text-black text-xs">
                  i
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>info</p>
              </TooltipContent>
            </Tooltip>*/}
        </div>
        {isPrimary && (
          <Scrollbar
            className="window"
            disableTracksWidthCompensation={true}
            noDefaultStyles={true}
            removeTrackXWhenNotUsed={true}
            scrollbarWidth={8}
          >
            <div className="flex-grow flex flex-col space-between px-4 py-2 space-y-2 leading-relaxed">
              {typeof children === 'function' ? children() : children}
              <div
                className="flex-grow space-y-2 leading-relaxed overflow-hidden"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              {date && (
                <div className="w-full py-2 pt-8 overflow-y-hidden">
                  <div className="font-mono text-xs text-gray-400 text-nowrap">
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
      </div>
    </Rnd>
  );
}
