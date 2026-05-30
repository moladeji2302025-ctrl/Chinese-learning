"use client";

import { useEffect, useRef } from "react";

interface HanziWriterProps {
  character: string;
  width?: number;
  height?: number;
  mode?: "animate" | "quiz" | "display";
  onQuizComplete?: (summary: { totalMistakes: number }) => void;
}

export default function HanziWriterCanvas({
  character,
  width = 200,
  height = 200,
  mode = "animate",
  onQuizComplete,
}: HanziWriterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamic import so SSR doesn't choke (HanziWriter needs window)
    import("hanzi-writer").then((mod) => {
      const HanziWriter = mod.default;

      containerRef.current!.innerHTML = "";

      const writer = HanziWriter.create(containerRef.current!, character, {
        width,
        height,
        padding: 8,
        strokeColor: "#f1f1f5",
        radicalColor: "#ff6464",
        outlineColor: "#2a2a38",
        drawingColor: "#fbbf24",
        strokeAnimationSpeed: 1,
        delayBetweenStrokes: 200,
        showOutline: true,
        showCharacter: mode !== "quiz",
      });

      writerRef.current = writer;

      if (mode === "animate") {
        writer.loopCharacterAnimation();
      } else if (mode === "quiz") {
        writer.quiz({
          onComplete: (summary: { totalMistakes: number }) => onQuizComplete?.(summary),
        });
      }
    });

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character, mode]);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className="rounded-xl bg-surface-2 border border-surface-border"
    />
  );
}
