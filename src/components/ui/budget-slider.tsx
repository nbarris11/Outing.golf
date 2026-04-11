"use client";

import { useState } from "react";

import { currency, cn } from "@/lib/utils";

export function BudgetSlider({
  id,
  name,
  defaultValue = 1200,
  min = 300,
  max = 3000,
  step = 50,
  className
}: {
  id: string;
  name: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [flexible, setFlexible] = useState(true);

  return (
    <div className={cn("rounded-[24px] bg-cream p-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-charcoal/48">Target per person</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-charcoal">
            {currency(value)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFlexible((f) => !f)}
          className={cn(
            "rounded-full px-3 py-1 text-xs ring-1 transition",
            flexible
              ? "bg-white text-charcoal/62 ring-charcoal/8 hover:ring-charcoal/20"
              : "bg-forest-900 text-cream ring-transparent"
          )}
        >
          {flexible ? "Flexible later" : "Budget fixed"}
        </button>
        <input type="hidden" name="budgetFlexible" value={flexible ? "true" : "false"} />
      </div>
      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-full bg-white accent-[rgb(20,58,44)]"
      />
      <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-charcoal/42">
        <span>{currency(min)}</span>
        <span>{currency(Math.round((min + max) / 2))}</span>
        <span>{currency(max)}</span>
      </div>
    </div>
  );
}
