"use client";

import { useEffect, useState } from "react";

interface Props {
  targetDate: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getTimeLeft(target: Date) {
  const now = Date.now();
  const diff = target.getTime() - now;

  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export function TripCountdown({ targetDate }: Props) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <p className="mt-8 text-2xl font-semibold text-cream">
        Trip in progress! 🏌️
      </p>
    );
  }

  return (
    <div className="mt-10 flex justify-center gap-4 sm:gap-8">
      {[
        { value: timeLeft.days, label: "days" },
        { value: timeLeft.hours, label: "hrs", pad: true },
        { value: timeLeft.minutes, label: "min", pad: true },
        { value: timeLeft.seconds, label: "sec", pad: true }
      ].map(({ value, label, pad: shouldPad }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-serif text-5xl font-semibold leading-none text-cream sm:text-6xl tabular-nums">
            {shouldPad ? pad(value) : value}
          </span>
          <span className="mt-2 text-xs uppercase tracking-widest text-cream/50">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
