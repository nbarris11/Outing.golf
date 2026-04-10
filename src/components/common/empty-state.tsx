import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  body,
  cta
}: {
  title: string;
  body: string;
  cta?: {
    href: string;
    label: string;
  };
}) {
  return (
    <Card className="rounded-[32px] bg-white/88 p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest-900/8 text-forest-900">
        <span className="font-serif text-2xl italic">O</span>
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-charcoal/66">{body}</p>
      {cta ? (
        <Link href={cta.href} className="mt-6 inline-flex">
          <Button>{cta.label}</Button>
        </Link>
      ) : null}
    </Card>
  );
}
