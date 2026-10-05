
export function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.35]"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="hsl(var(--primary))" strokeWidth="1.5">
          <path
            className="animate-circuit-flow"
            d="M -50 120 H 260 V 260 H 520 V 80 H 780 V 340 H 1250"
            strokeDasharray="8 10"
          />
          <path
            className="animate-circuit-flow"
            style={{ animationDelay: "-2s" }}
            d="M -50 480 H 180 V 620 H 460 V 460 H 900 V 620 H 1250"
            strokeDasharray="8 10"
          />
          <path
            className="animate-circuit-flow"
            style={{ animationDelay: "-4s" }}
            d="M 100 -50 V 200 H 340 V 500 H 620 V 850"
            strokeDasharray="8 10"
          />
        </g>

        {[
          [260, 120],
          [520, 260],
          [780, 80],
          [180, 480],
          [460, 620],
          [900, 460],
          [340, 200],
          [620, 500],
        ].map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={4}
            fill="hsl(var(--primary))"
            className="animate-signal-pulse"
            style={{ animationDelay: `${i * 0.35}s`, transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
      </svg>

      {/* Fade the grid out toward the edges so it frames content instead of competing with it. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_75%)]" />
    </div>
  );
}
