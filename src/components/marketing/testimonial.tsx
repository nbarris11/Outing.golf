interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  tripDestination?: string;
  year?: number;
  photoUrl?: string;
}

export function Testimonial({
  quote,
  author,
  role,
  tripDestination,
  year,
  photoUrl
}: TestimonialProps) {
  const isPlaceholder = !photoUrl;
  const meta = [tripDestination, year].filter(Boolean).join(" · ");

  return (
    <div
      className="rounded-[28px] bg-cream px-6 py-6 ring-1 ring-charcoal/8"
      data-placeholder={isPlaceholder ? "true" : undefined}
    >
      <p className="text-base leading-7 text-charcoal/78">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={author}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-900 text-xs font-semibold text-cream">
            {author.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-charcoal">{author}</p>
          <p className="text-xs text-charcoal/50">
            {role}
            {meta ? ` · ${meta}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
