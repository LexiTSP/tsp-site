import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateHash(h: string, n = 8): string {
  if (h.length <= n * 2 + 3) return h;
  return `${h.slice(0, n)}…${h.slice(-n)}`;
}
