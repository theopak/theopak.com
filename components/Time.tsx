import { useEffect, useRef } from "react";
import { getFormattedTime } from "./getFormattedTime";
import { LoadingDots } from "./LoadingDots";

export function Time() {
  const refForRaf = useRef<number | null>(null);
  const refForElement = useRef<HTMLDivElement>(null);
  const refForIsReady = useRef(true);

  useEffect(() => {
    let raf = refForRaf.current;
    raf = requestAnimationFrame(function updateClock() {
      if (refForElement.current && refForIsReady.current) {
        refForElement.current.textContent = getFormattedTime();
        refForIsReady.current =
          window?.matchMedia("(prefers-reduced-motion: reduce)")?.matches !==
          true;
      }
      raf = requestAnimationFrame(updateClock);
    });
    return () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);

  return (
    <span ref={refForElement}>
      <LoadingDots />
    </span>
  );
}
