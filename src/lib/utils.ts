import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This cn function helps us merge different classnames.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatTimeDelta(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = seconds % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secondsLeft > 0) {
    parts.push(`${secondsLeft}s`);
  }
  return parts.join(' ');
}