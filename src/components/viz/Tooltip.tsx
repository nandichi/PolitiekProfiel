"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { type ReactNode } from "react";

interface VizTooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function VizTooltip({
  children,
  content,
  side = "top",
  delay = 100,
}: VizTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={delay} skipDelayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side={side}
            sideOffset={10}
            collisionPadding={12}
            className="z-50 select-none bg-ink text-paper px-3 py-2 mono text-[0.72rem] tracking-wide shadow-[0_18px_30px_-20px_rgba(14,16,20,0.5)]"
          >
            {content}
            <Tooltip.Arrow className="fill-ink" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
