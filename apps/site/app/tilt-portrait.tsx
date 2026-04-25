"use client";

import { Surface } from "@marco-trevisani/alien-ui";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type TiltStyle = CSSProperties & {
  "--tilt-x"?: string;
  "--tilt-y"?: string;
};

export function TiltPortrait({ children }: { children: ReactNode }) {
  const portraitRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<TiltStyle>({
    "--tilt-x": "0deg",
    "--tilt-y": "0deg"
  });

  useEffect(() => {
    const portrait = portraitRef.current;
    const stage = portrait?.closest(".portrait-stage");

    if (!portrait || !stage) {
      return;
    }

    const activePortrait = portrait;
    const activeStage = stage;

    function resetTilt() {
      setStyle({
        "--tilt-x": "0deg",
        "--tilt-y": "0deg"
      });
    }

    function updateTilt(event: Event) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const pointerEvent = event as globalThis.PointerEvent;
      const stageRect = activeStage.getBoundingClientRect();

      if (
        pointerEvent.clientX < stageRect.left ||
        pointerEvent.clientX > stageRect.right ||
        pointerEvent.clientY < stageRect.top ||
        pointerEvent.clientY > stageRect.bottom
      ) {
        resetTilt();
        return;
      }

      const rect = activePortrait.getBoundingClientRect();
      const x = Math.min(
        Math.max(pointerEvent.clientX - rect.left, 0),
        rect.width
      );
      const y = Math.min(
        Math.max(pointerEvent.clientY - rect.top, 0),
        rect.height
      );
      const xRatio = x / rect.width - 0.5;
      const yRatio = y / rect.height - 0.5;

      setStyle({
        "--tilt-x": `${(-yRatio * 14).toFixed(2)}deg`,
        "--tilt-y": `${(xRatio * 16).toFixed(2)}deg`
      });
    }

    document.addEventListener("pointermove", updateTilt);
    stage.addEventListener("pointerleave", resetTilt);

    return () => {
      document.removeEventListener("pointermove", updateTilt);
      stage.removeEventListener("pointerleave", resetTilt);
    };
  }, []);

  return (
    <Surface ref={portraitRef} className="portrait" style={style}>
      {children}
    </Surface>
  );
}
