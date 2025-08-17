import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This cn function helps us merge different classnames.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
