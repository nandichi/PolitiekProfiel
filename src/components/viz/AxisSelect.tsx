"use client";

import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { DIMENSIONS, type DimensionId } from "@/lib/dimensions";

interface AxisSelectProps {
  value: DimensionId;
  onChange: (id: DimensionId) => void;
  label: string;
  disabledIds?: DimensionId[];
}

export function AxisSelect({
  value,
  onChange,
  label,
  disabledIds = [],
}: AxisSelectProps) {
  return (
    <label className="block">
      <span className="kicker">{label}</span>
      <Select.Root
        value={value}
        onValueChange={(v) => onChange(v as DimensionId)}
      >
        <Select.Trigger
          className="mt-2 inline-flex min-h-11 w-full items-center justify-between border-b border-rule-strong bg-transparent py-2 text-left text-base text-ink transition-colors hover:border-ink focus-visible:border-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
          aria-label={label}
        >
          <Select.Value />
          <Select.Icon>
            <ChevronDown size={16} strokeWidth={1.7} className="text-text-muted" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            className="z-50 min-w-(--radix-select-trigger-width) bg-canvas border border-rule-strong shadow-[0_20px_40px_-20px_rgba(14,16,20,0.25)]"
          >
            <Select.Viewport className="p-1">
              {DIMENSIONS.map((d) => {
                const disabled = disabledIds.includes(d.id);
                return (
                  <Select.Item
                    key={d.id}
                    value={d.id}
                    disabled={disabled}
                    className="relative flex min-h-11 cursor-default select-none items-center gap-2 px-3 py-2 text-sm text-ink data-highlighted:bg-canvas-pressed data-highlighted:outline-none data-disabled:cursor-not-allowed data-disabled:text-text-muted"
                  >
                    <Select.ItemIndicator>
                      <Check size={14} strokeWidth={1.8} />
                    </Select.ItemIndicator>
                    <Select.ItemText>{d.label}</Select.ItemText>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </label>
  );
}
