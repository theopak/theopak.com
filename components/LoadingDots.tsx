export function LoadingDots() {
  const style = {
    animationDuration: `${900}ms`,
    animationTimingFunction: "steps(4, end)",
    animationIterationCount: "infinite",
    animationName: "appear",
    opacity: 0,
  } as const;

  return (
    <>
      <span className="select-none not-sr-only" style={style}>
        .
      </span>
      <span className="select-none not-sr-only" style={style}>
        .
      </span>
      <span className="select-none not-sr-only" style={style}>
        .
      </span>
    </>
  );
}
