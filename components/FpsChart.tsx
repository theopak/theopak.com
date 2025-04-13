'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import { useFps } from 'react-fps';
import { LoadingDots } from './LoadingDots';

export function FpsChart({ height = 20, width = 280 }) {
  const { avgFps, currentFps, fps, maxFps } = useFps(width);

  const bars = useMemo<Array<JSX.Element>>(() => {
    const result: Array<JSX.Element> = [];
    const maxBars = 100;
    const limit = Math.min(fps.length, maxBars);
    for (let i = 0; i < limit; i++) {
      const value = fps.at(-i) || 0;
      const h = (value / maxFps) * height || height;
      const w = 2;
      const gap = 1;
      let filterName = '';
      if (!value) {
        filterName = 'url(#green-t-grey)';
      } else if (value > 50) {
        filterName = '';
      } else if (value > 30) {
        filterName = 'url(#green-to-yellow)';
      } else {
        filterName = 'url(#green-to-red)';
      }
      const bar = (
        <rect
          key={i}
          fill="url(#bar-pattern)"
          filter={filterName}
          height={h}
          width={w}
          x={width - i * (w + gap)}
          y={height - h}
        />
      );
      result.push(bar);
    }
    return result;
  }, [fps, height, maxFps, width]);

  return (
    <div className="border border-neutral-600 p-1 pt-2">
      <div className="relative">
        <div
          className="bg-black inline absolute px-1 text-xs"
          style={{ top: '-1.1rem' }}
        >
          PERFORMANCE MONITOR
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="flex justify-between">
          <span>FPS:</span>
          <span>{bars.length ? currentFps.toFixed(2) : <LoadingDots />}</span>
        </span>
        <span className="flex justify-between">
          <span>FPS (avg):</span>
          <span>{bars.length ? avgFps : <LoadingDots />}</span>
        </span>
        <span className="flex justify-between">
          <span>FPS (max):</span>
          <span>{bars.length ? maxFps.toFixed(2) : <LoadingDots />}</span>
        </span>
        <div className="flex justify-between gap-1">
          <span className="grow-0 whitespace-nowrap">FPS history:</span>
          <div className="grow align-right text-right">
            {bars.length ? (
              <svg
                height="100%"
                width="100%"
                preserveAspectRatio="xMaxYMin slice"
                viewBox={`0, 0, ${width}, ${height}`}
              >
                <defs>
                  <pattern
                    id="bar-pattern"
                    width={3}
                    height={4}
                    x={0}
                    y={0}
                    patternContentUnits="userSpaceOnUse"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="1" fill="green" />
                  </pattern>
                  <filter id="green-to-yellow">
                    <feColorMatrix
                      type="matrix"
                      values="
                        1 0 0 1 0
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0
                      "
                    />
                  </filter>
                  <filter id="green-to-red">
                    <feColorMatrix
                      type="matrix"
                      values="
                        0 1 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0
                      "
                    />
                  </filter>
                  <filter id="green-to-grey">
                    <feColorMatrix
                      type="matrix"
                      values="
                        0 0.5 0 0 0
                        0 0.5 0 0 0
                        0 0.5 0 0 0
                        0 0   0 1 0
                      "
                    />
                  </filter>
                </defs>
                {bars}
              </svg>
            ) : (
              <LoadingDots />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
