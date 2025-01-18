'use client';

import type { ReactNode } from 'react';
import Scrollbar from 'react-scrollbars-custom';
import { getFormattedTime } from './getFormattedTime';

type Props = {
  children?: ReactNode | (() => ReactNode) | null;
  date?: Date | null;
  html?: string | null;
};

export function WindowChild({ children, date, html }: Props) {
  return (
    <Scrollbar
      className="flex-grow"
      disableTracksWidthCompensation={true}
      noDefaultStyles={true}
      removeTrackXWhenNotUsed={true}
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
  );
}
