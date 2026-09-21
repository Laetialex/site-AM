import { siteConfig } from "@/config/site.config";

export type DropStatus = "upcoming" | "active" | "ended";

export function getDropStatus(now: Date = new Date()): DropStatus {
  const start = new Date(siteConfig.drop.startDate);
  const end = new Date(siteConfig.drop.endDate);
  if (now < start) return "upcoming";
  if (now >= end) return "ended";
  return "active";
}

export function isDropEnded(now: Date = new Date()) {
  return getDropStatus(now) === "ended";
}

export function formatDropDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
