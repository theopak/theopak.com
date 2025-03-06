import type { PropsWithChildren } from 'react';
import { use } from 'react';
import type { Grid, Props as RndProps } from 'react-rnd';
import { Rnd } from 'react-rnd';
import { WindowContext } from './WindowContext';
import { WindowChild } from './WindowChild';

const DRAG_GRID = [16, 16] as Grid;

type Props = PropsWithChildren<{
  date?: Date | null;
  id: string;
  isPrimary?: boolean | null;
  title?: string | null;
}> &
  Omit<RndProps, 'default'>;

export function Window({
  children,
  date,
  html,
  id,
  isPrimary,
  title,
  ...rest
}: Props) {
  const { setClosed, setOpen, updateWindow } = use(WindowContext);
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
        className="grow flex flex-col h-full overflow-hidden"
        role={isPrimary ? 'main' : undefined}
        aria-labelledby={elementId}
      >
        <div className="flex border-b border-white grow-0 font-mono font-extrabold cursor-move">
          <button
            className="border-r w-9 cursor-pointer hover:bg-gray-600 active:bg-gray-400"
            onClick={() => setClosed(id)}
          >
            ×
          </button>
          <h1 id={elementId} className="p-2 truncate">
            {title}
          </h1>
        </div>
        {isPrimary && (
          <WindowChild date={date} html={html}>
            {children}
          </WindowChild>
        )}
      </article>
    </Rnd>
  );
}
