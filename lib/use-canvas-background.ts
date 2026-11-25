"use client";

import { useSyncExternalStore } from "react";

import {
  BACKGROUND_STORAGE_KEY,
  DEFAULT_BACKGROUND_ID,
  isBackgroundId,
  type BackgroundId,
} from "@/config/background";

const listeners = new Set<() => void>();
let cache: BackgroundId | null = null;

function readBackground(): BackgroundId {
  if (typeof window === "undefined") return DEFAULT_BACKGROUND_ID;
  try {
    const stored = window.localStorage.getItem(BACKGROUND_STORAGE_KEY);
    return isBackgroundId(stored) ? stored : DEFAULT_BACKGROUND_ID;
  } catch {
    return DEFAULT_BACKGROUND_ID;
  }
}

function getSnapshot(): BackgroundId {
  if (cache === null) cache = readBackground();
  return cache;
}

function getServerSnapshot(): BackgroundId {
  return DEFAULT_BACKGROUND_ID;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== BACKGROUND_STORAGE_KEY) return;
    cache = null;
    listeners.forEach((listener) => listener());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function writeCanvasBackground(id: BackgroundId) {
  cache = id;
  document.documentElement.dataset.bg = id;
  try {
    window.localStorage.setItem(BACKGROUND_STORAGE_KEY, id);
  } catch {
    // Storage can be unavailable; the background still changes for this visit.
  }
  listeners.forEach((listener) => listener());
}

export function useCanvasBackground(): BackgroundId {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
