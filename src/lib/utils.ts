import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMatchTime(time: number): string {
  const minutes = Math.floor(time);
  const seconds = Math.floor((time - minutes) * 60);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Helper function to generate random number between min and max
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Helper function to generate random integer between min and max
export function randomIntBetween(min: number, max: number): number {
  return Math.floor(randomBetween(min, max));
}
