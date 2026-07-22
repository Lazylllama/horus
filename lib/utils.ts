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

const CaughtUpTexts = [
  "You're all caught up!",
  "Keep it up!",
  "Nothing new yet!",
];

export function caughtUpText() {
  const randomIndex = Math.floor(Math.random() * CaughtUpTexts.length);
  return CaughtUpTexts[randomIndex];
}

const minute = 60,
  hour = minute * 60,
  day = hour * 24;

export function relativeTime(delta: number) {
  let since: string;

  if (delta < 30) {
    since = "just then.";
  } else if (delta < minute) {
    since = `${delta} seconds ago.`;
  } else if (delta < 2 * minute) {
    since = "a minute ago.";
  } else if (delta < hour) {
    since = `${Math.floor(delta / minute)} minutes ago.`;
  } else if (Math.floor(delta / hour) === 1) {
    since = "1 hour ago.";
  } else if (delta < day) {
    since = `${Math.floor(delta / hour)} hours ago.`;
  } else if (delta < day * 2) {
    since = "yesterday.";
  } else {
    since = `${Math.floor(delta / day)} days ago.`;
  }

  return since;
}

export function SlackChannelLink(channelId: string) {
  return `slack://channel?team=E09V59WQY1E&id=${channelId}`;
  //return `https://hackclub.enterprise.slack.com/archives/${channelId}`;
}

export function SlackMessageLink(channelId: string, messageTs: string) {
  //! /p${messageTs.replace(".", "")} for normal link
  return `${SlackChannelLink(channelId)}&thread_ts=${messageTs}`;
}

const KnownErrors: { [key: string]: string } = {
  "Invalid tickets data":
    "We were unable to fetch the data from the nephthys instance, please make sure that the host is working normally.",
  "Couldn't find organization by slug":
    "We were unable to find the organization by the slug, please make sure that the slug in the URL is correct and that the organization exists.",
};

export function GetErrorDescription(error: Error) {
  if (KnownErrors[error.message]) {
    return KnownErrors[error.message];
  }
  return error.message;
}

// Currently only one person is super admin and rest is separated by org/instance
export function userIsSuperAdmin(id: string | undefined): boolean {
  return id === process.env.NEXT_PUBLIC_SUPER_ADMIN_ID;
}
