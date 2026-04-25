"use client";

import { Surface } from "@marco-trevisani/alien-ui";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useState } from "react";

type TiltStyle = CSSProperties & {
  "--tilt-x"?: string;
  "--tilt-y"?: string;
};

export function TiltPortrait({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<TiltStyle>({
    "--tilt-x": "0deg",
    "--tilt-y": "0deg"
  });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setStyle({
      "--tilt-x": `${(-y * 8).toFixed(2)}deg`,
      "--tilt-y": `${(x * 10).toFixed(2)}deg`
    });
  }

  function handlePointerLeave() {
    setStyle({
      "--tilt-x": "0deg",
      "--tilt-y": "0deg"
    });
  }

  return (
    <Surface
      className="portrait"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={style}
    >
      {children}
    </Surface>
  );
}
