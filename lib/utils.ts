import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function greet(name: string) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting: string;

  if (currentHour < 6) {
    greeting = `Still up, ${name}`;
  } else if (currentHour < 12) {
    greeting = `Morning, ${name}`;
  } else if (currentHour < 18) {
    greeting = `Afternoon, ${name}`;
  } else {
    greeting = `Evening, ${name}`;
  }

  return greeting;
}
