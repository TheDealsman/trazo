"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  solidStarDef,
  sparkleCrossDef,
  sparkleFourDef,
  starOutlineDef,
} from "trazo/catalog/hearts";
import { starfishDef } from "trazo/catalog/ocean";
import type { StickerDef } from "trazo/core";
import { Sticker } from "trazo/scribble";

import { BackgroundPicker } from "@/components/trazo/background-picker";
import { AkoderMark, GitHubLogo } from "@/components/trazo/icons";
import { useTrazo } from "@/components/trazo/trazo-experience";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { resolveStickerColor } from "@/config/palette";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const STAR_MILESTONE = 100;
const PUFF_START_DELAY_MS = 480;
const PUFF_DURATION_MS = 1280;

const enterSpring = { type: "spring", stiffness: 380, damping: 30 } as const;
const flipSpring = { type: "spring", stiffness: 420, damping: 24, mass: 0.55 } as const;
const sparklePopSpring = { type: "spring", stiffness: 460, damping: 22, mass: 0.5 } as const;
const puffEase = [0.22, 1, 0.36, 1] as const;
const enterFrom = { opacity: 0, y: -12, scale: 0.96 } as const;
const enterTo = { opacity: 1, y: 0, scale: 1 } as const;
const reduceEntrance = "motion-reduce:opacity-100! motion-reduce:transform-none!";

const PILL_CLASS =
  "pointer-events-auto flex items-center rounded-[18px] bg-popover/92 p-1 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_30px_-10px_rgba(0,0,0,0.14)] ring-1 ring-foreground/[0.07] backdrop-blur-md sm:rounded-[20px]";

interface SparkleParticleSpec {
  id: string;
  def: StickerDef;
  size: number;
  left: string;
  top: string;
  tx: number;
  ty: number;
  rotateFrom: number;
  rotateTo: number;
  delay: number;
  duration: number;
}

// Trajectories bias left & downward so particles stay well inside the top-right viewport margins.
const MILESTONE_PUFF_PARTICLES: readonly SparkleParticleSpec[] = [
  {
    id: "sparkle-four",
    def: sparkleFourDef,
    size: 13,
    left: "12%",
    top: "14%",
    tx: -24,
    ty: -10,
    rotateFrom: -18,
    rotateTo: 10,
    delay: 0,
    duration: 1.12,
  },
  {
    id: "star-outline",
    def: starOutlineDef,
    size: 12,
    left: "4%",
    top: "68%",
    tx: -28,
    ty: 14,
    rotateFrom: -10,
    rotateTo: 18,
    delay: 0.08,
    duration: 1.18,
  },
  {
    id: "solid-star",
    def: solidStarDef,
    size: 12,
    left: "44%",
    top: "86%",
    tx: -8,
    ty: 22,
    rotateFrom: 14,
    rotateTo: -14,
    delay: 0.14,
    duration: 1.22,
  },
  {
    id: "sparkle-cross",
    def: sparkleCrossDef,
    size: 11,
    left: "84%",
    top: "82%",
    tx: 8,
    ty: 18,
    rotateFrom: 12,
    rotateTo: -16,
    delay: 0.18,
    duration: 1.16,
  },
];

function formatStarCount(count: number): string {
  if (count >= 1000) {
    const compact = (count / 1000).toFixed(count >= 10000 ? 0 : 1);
    return `${compact.replace(/\.0$/, "")}k`;
  }
  return count.toLocaleString("en-US");
}

function CornerSparkle({
  def,
  size,
  color,
  baseRotate,
  reduceMotion,
  className,
}: {
  def: StickerDef;
  size: number;
  color: string | undefined;
  baseRotate: number;
  reduceMotion: boolean | null;
  className: string;
}) {
  return (
    <motion.span
      aria-hidden="true"
      initial={reduceMotion ? { opacity: 0.9, scale: 1 } : { opacity: 0, scale: 0.35, rotate: baseRotate - 12 }}
      animate={reduceMotion ? { opacity: 0.9, scale: 1 } : { opacity: 1, scale: 1, rotate: baseRotate }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.35, rotate: baseRotate + 10 }}
      transition={reduceMotion ? { duration: 0 } : sparklePopSpring}
      className={cn("pointer-events-none absolute z-20", className)}
    >
      <motion.span
        className="block"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [0.88, 1.14, 0.88],
                rotate: [0, 12, 0],
                opacity: [0.74, 1, 0.74],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 1.75,
                delay: 0.22,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <Sticker def={def} size={size} color={color} />
      </motion.span>
    </motion.span>
  );
}

function GitHubStarBadge({ stars }: { stars: number | null }) {
  const { paletteId } = useTrazo();
  const activeColor = resolveStickerColor(paletteId);
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [introCelebrating, setIntroCelebrating] = useState(false);

  const isMilestone = stars !== null && stars >= STAR_MILESTONE;
  const activeIntro = isMilestone && !reduceMotion && introCelebrating;
  const flipped = hovered || activeIntro;

  useEffect(() => {
    if (!isMilestone || reduceMotion) {
      return;
    }

    const startTimer = window.setTimeout(() => {
      setIntroCelebrating(true);
    }, PUFF_START_DELAY_MS);

    const endTimer = window.setTimeout(() => {
      setIntroCelebrating(false);
    }, PUFF_START_DELAY_MS + PUFF_DURATION_MS);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, [isMilestone, reduceMotion]);

  return (
    <div className="relative" data-milestone={isMilestone ? "true" : undefined}>
      {/* One-time subtle crayon sparkle puff on first load when stars >= 100 */}
      <AnimatePresence>
        {activeIntro ? (
          <div
            key="milestone-puff"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-visible"
          >
            {MILESTONE_PUFF_PARTICLES.map((particle) => (
              <motion.span
                key={particle.id}
                style={{ left: particle.left, top: particle.top }}
                initial={{
                  opacity: 0,
                  x: 0,
                  y: 0,
                  scale: 0.28,
                  rotate: particle.rotateFrom,
                }}
                animate={{
                  opacity: [0, 1, 0.92, 0],
                  x: [0, particle.tx * 0.48, particle.tx * 0.92, particle.tx],
                  y: [0, particle.ty * 0.48, particle.ty * 0.92, particle.ty - 4],
                  scale: [0.28, 1.12, 0.96, 0.64],
                  rotate: [
                    particle.rotateFrom,
                    (particle.rotateFrom + particle.rotateTo) / 2,
                    particle.rotateTo,
                    particle.rotateTo,
                  ],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  times: [0, 0.2, 0.65, 1],
                  ease: puffEase,
                }}
                className="absolute"
              >
                <Sticker def={particle.def} size={particle.size} color={activeColor} />
              </motion.span>
            ))}
          </div>
        ) : null}
      </AnimatePresence>

      {/* Subtle corner sparkles while hovering/focusing the pill at 100+ stars */}
      <AnimatePresence>
        {isMilestone && hovered ? (
          <>
            <CornerSparkle
              key="corner-tl"
              def={sparkleFourDef}
              size={13}
              color={activeColor}
              baseRotate={-14}
              reduceMotion={reduceMotion}
              className="-left-2 -top-1.5"
            />
            <CornerSparkle
              key="corner-br"
              def={starOutlineDef}
              size={12}
              color={activeColor}
              baseRotate={16}
              reduceMotion={reduceMotion}
              className="-bottom-1.5 -right-1.5"
            />
          </>
        ) : null}
      </AnimatePresence>

      <div className={cn(PILL_CLASS, "relative z-10")}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
              aria-label={
                stars !== null
                  ? `Star Trazo on GitHub (${stars.toLocaleString("en-US")} stars, opens in a new tab)`
                  : "Star Trazo on GitHub (opens in a new tab)"
              }
              className="group flex h-8 items-center gap-1.5 rounded-[14px] px-2.5 text-xs font-medium text-foreground outline-none micro-transition hover:bg-muted active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-ring sm:h-9 sm:gap-2 sm:px-3"
            >
              <span
                aria-hidden
                className="relative flex size-[22px] shrink-0 items-center justify-center [perspective:260px]"
              >
                <motion.span
                  animate={{
                    rotateY: flipped ? 180 : 0,
                    scale: flipped && !reduceMotion ? 1.12 : 1,
                  }}
                  transition={reduceMotion ? { duration: 0 } : flipSpring}
                  className="relative flex size-full items-center justify-center [transform-style:preserve-3d]"
                >
                  <span className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden]">
                    <GitHubLogo className="size-[17px] text-foreground" />
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <motion.span
                      className="flex items-center justify-center"
                      animate={
                        activeIntro
                          ? {
                              rotate: [-6, -18, 10, -10, -6],
                              scale: [1, 1.14, 1.1, 1.05, 1],
                            }
                          : { rotate: -6, scale: 1 }
                      }
                      transition={
                        activeIntro
                          ? { duration: 0.62, ease: puffEase }
                          : { duration: 0.2 }
                      }
                    >
                      <Sticker def={starfishDef} size={22} />
                    </motion.span>
                  </span>
                </motion.span>
              </span>

              {stars !== null ? (
                <span className="font-mono text-[12px] font-medium tabular-nums text-foreground">
                  {formatStarCount(stars)}
                </span>
              ) : (
                <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                  Star
                </span>
              )}
            </a>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end">
            {isMilestone ? (
              <p className="font-caveat text-[16px] leading-none text-[#f9a8d4]">
                100+ stars — thank you!
              </p>
            ) : (
              <p>
                {stars !== null
                  ? `${stars.toLocaleString("en-US")} stars on GitHub`
                  : "Star on GitHub"}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export function TopBar({ stars }: { stars: number | null }) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="pointer-events-none fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-[max(1rem,env(safe-area-inset-top))]">
      {/* Author attribution */}
      <motion.div
        data-no-pan=""
        initial={enterFrom}
        animate={enterTo}
        transition={reduceMotion ? { duration: 0 } : { ...enterSpring, delay: 0.16 }}
        className={cn(PILL_CLASS, reduceEntrance)}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={siteConfig.author.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Built by ${siteConfig.author.name} (opens in a new tab)`}
              className="group flex h-8 items-center gap-1 rounded-[14px] px-2.5 text-xs text-muted-foreground outline-none micro-transition hover:bg-muted hover:text-foreground active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring sm:h-9 sm:px-3"
            >
              <span className="font-caveat text-[18px] leading-none text-muted-foreground/85 transition-colors group-hover:text-foreground">
                by
              </span>{" "}
              <span className="inline-flex items-baseline font-medium text-foreground">
                <AkoderMark className="mr-[0.5px] inline-block size-[13px] shrink-0 translate-y-[1.5px] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-rotate-6 group-hover:scale-110" />
                <span className="sr-only">A</span>
                <span>ditya</span>
              </span>
            </a>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            <p>{siteConfig.author.name} · akoder.xyz</p>
          </TooltipContent>
        </Tooltip>
      </motion.div>

      <motion.div
        data-no-pan=""
        initial={enterFrom}
        animate={enterTo}
        transition={reduceMotion ? { duration: 0 } : { ...enterSpring, delay: 0.22 }}
        className={cn(reduceEntrance, "flex items-center gap-1.5 sm:gap-2")}
      >
        <BackgroundPicker />
        <GitHubStarBadge stars={stars} />
      </motion.div>
    </header>
  );
}
