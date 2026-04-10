import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function FieldLabel({
  children,
  htmlFor
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-charcoal">
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-charcoal/35 focus:border-forest-600",
        props.className
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 text-sm outline-none transition focus:border-forest-600",
        props.className
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-charcoal/10 bg-cream px-4 py-3 text-sm outline-none transition placeholder:text-charcoal/35 focus:border-forest-600",
        props.className
      )}
    />
  );
}
