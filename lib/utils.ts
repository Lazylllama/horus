import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function greet(name: string | undefined | null): string {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting: string;

  if (currentHour < 6) {
    greeting = name ? `Still up, ${name}.` : "Still up?";
  } else if (currentHour < 12) {
    greeting = name ? `Morning, ${name}.` : "Good morning";
  } else if (currentHour < 18) {
    greeting = name ? `Afternoon, ${name}.` : "Good afternoon";
  } else {
    greeting = name ? `Evening, ${name}.` : "Good evening";
  }

  return greeting;
}
