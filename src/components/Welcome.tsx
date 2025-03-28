import React from "react";

import { getRandomToyColor } from "../utils.ts";

function Orbiter() {
  const divRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const div = divRef.current;
    if (!div) return;
    const keyframes: Keyframe[] = [];
    const color = getRandomToyColor();
    const phaseX = Math.random();
    const phaseY = Math.random();
    const phaseZ = Math.random();
    const nTurns = 1 + Math.ceil(Math.random() * 5) * (Math.random() < 0.5 ? -1 : 1);
    const duration = 6000 + Math.random() * 6000;
    const steps = 30;
    const animSize = 15;
    for (let i = 0; i < steps; i++) {
      const p = i / (steps - 1);
      const x = Math.cos((phaseX + p) * Math.PI * 2) * animSize;
      const y = Math.sin((phaseY + p) * Math.PI * 2) * animSize;
      const z = Math.sin((phaseZ + p) * Math.PI * 2) * animSize;
      keyframes.push({
        transform: `translate3d(${x}vmin, ${y}vmin, ${z}vmin) rotate(${p * nTurns}turn)`,
        opacity: z < 0 ? 0.5 : 1,
        zIndex: Math.round(z * 10),
        color: color.hex,
      });
    }
    div.animate(keyframes, {
      duration,
      iterations: Infinity,
      easing: "linear",
    });
  }, []);
  return (
    <div className="absolute will-change-transform font-mono leading-none text-3xl pointer-events-none" ref={divRef}>
      *
    </div>
  );
}

export function Welcome() {
  const [reducedMotion] = React.useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  return (
    <div className="grow flex items-middle justify-center items-center relative perspective-distant">
      {reducedMotion ? null : (
        <>
          <Orbiter />
          <Orbiter />
          <Orbiter />
          <Orbiter />
          <Orbiter />
          <Orbiter />
          <Orbiter />
          <Orbiter />
          <Orbiter />
        </>
      )}
      <div className="text-center max-w-64 z-0 cursor-default">
        Welcome to my toybox!
        <br />
        Please find here some toys that are small enough not to require an app of their own, but big enough to be useful
        or fun.
        <div className="mt-4">
          – Best,{" "}
          <a href="https://akx.github.io" className="underline decoration-dotted">
            @akx
          </a>
        </div>
      </div>
    </div>
  );
}
