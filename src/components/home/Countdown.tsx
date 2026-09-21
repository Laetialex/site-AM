"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function splitDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-serif text-3xl text-am-offwhite tabular-nums sm:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] tracking-[0.15em] text-am-offwhite-muted uppercase">
        {label}
      </span>
    </div>
  );
}

export function Countdown({
  targetDate,
  initialRemainingMs,
}: {
  targetDate: string;
  /** Calculé côté serveur pour le premier rendu — évite tout décalage d'hydratation. */
  initialRemainingMs: number;
}) {
  const [remainingMs, setRemainingMs] = useState(initialRemainingMs);
  const router = useRouter();

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const next = target - Date.now();
      setRemainingMs(next);
      if (next <= 0) {
        clearInterval(interval);
        router.refresh();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, router]);

  if (remainingMs <= 0) return null;

  const { days, hours, minutes, seconds } = splitDuration(remainingMs);

  return (
    <div className="flex items-start gap-5 sm:gap-8">
      <Segment value={days} label="Jours" />
      <Segment value={hours} label="Heures" />
      <Segment value={minutes} label="Min" />
      <Segment value={seconds} label="Sec" />
    </div>
  );
}
