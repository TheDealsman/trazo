"use client";

import { useState } from "react";

import { Moon, Sun } from "@/components/trazo/overlay-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { backgroundOptions, findBackgroundOption } from "@/config/background";
import {
  useCanvasBackground,
  writeCanvasBackground,
} from "@/lib/use-canvas-background";
import { cn } from "@/lib/utils";

export function BackgroundPicker() {
  const backgroundId = useCanvasBackground();
  const [open, setOpen] = useState(false);
  const active = findBackgroundOption(backgroundId);
  const BackgroundIcon = active.dark ? Moon : Sun;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Background color"
          aria-label={`Background: ${active.label}. Choose a background color`}
          className="pointer-events-auto flex size-9 items-center justify-center rounded-[16px] bg-popover/92 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_30px_-10px_rgba(0,0,0,0.14)] ring-1 ring-foreground/[0.07] backdrop-blur-md micro-transition hover:bg-muted active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-10 sm:rounded-[18px]"
        >
          <BackgroundIcon className="size-[19px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={12}
        className="w-[min(232px,calc(100vw-1.5rem))] rounded-2xl p-2.5"
      >
        <div className="px-1 pb-2 pt-0.5">
          <span className="font-caveat text-lg leading-none text-foreground">
            background
          </span>
        </div>
        <div
          role="radiogroup"
          aria-label="Background color"
          className="grid grid-cols-3 gap-1"
        >
          {backgroundOptions.map((option) => {
            const isSelected = option.id === backgroundId;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={option.label}
                onClick={() => {
                  writeCanvasBackground(option.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-[11px] font-medium micro-transition active:scale-[0.95]",
                  isSelected
                    ? "bg-muted text-foreground ring-2 ring-foreground"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  style={{ backgroundColor: option.hex }}
                  className={cn(
                    "size-7 rounded-full shadow-[inset_0_-2px_0_rgba(0,0,0,0.16),inset_0_1.5px_0_rgba(255,255,255,0.35),0_1px_2px_rgba(0,0,0,0.12)] ring-1 ring-inset ring-black/10",
                    option.dark && "ring-white/20",
                  )}
                />
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
