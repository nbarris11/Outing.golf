interface Props {
  courseName: string;
  locationLabel: string;
  rounds: number;
  storedGreensFee?: number;
}
export function CoursePriceDisplay({
  courseName,
  locationLabel,
  rounds,
  storedGreensFee = 0,
}: Props) {
  return (
    <div className="text-right">
      <p className="font-semibold text-charcoal">
        {storedGreensFee > 0
          ? `$${Math.round(storedGreensFee * rounds).toLocaleString()}/person`
          : "Price needed"}
      </p>
      <p className="text-xs text-charcoal/55">
        {storedGreensFee > 0
          ? `$${storedGreensFee} × ${rounds} round${rounds === 1 ? "" : "s"} · estimate`
          : "Not included in the estimate yet"}
      </p>
      {storedGreensFee <= 0 && (
        <a
          className="text-xs underline"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.google.com/search?q=${encodeURIComponent(`${courseName} ${locationLabel} greens fee`)}`}
        >
          Check course rates ↗
        </a>
      )}
    </div>
  );
}
