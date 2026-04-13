interface Member {
  name: string;
  email: string;
  role: string;
  homeCity?: string | null;
}

interface Props {
  members: Member[];
}

export function TripLineup({ members }: Props) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-charcoal/6">
      <h3 className="font-serif text-xl font-semibold text-forest-900">The lineup</h3>
      <p className="mt-1 text-sm text-charcoal/50">{members.length} players</p>

      <ul className="mt-4 grid grid-cols-1 gap-3">
        {members.map((member, index) => {
          const isOrganizer = member.role === "organizer";
          const initials = member.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <li
              key={index}
              className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-forest-900/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-forest-900">{initials}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm text-charcoal truncate">{member.name}</p>
                  {isOrganizer && <span title="Organizer">👑</span>}
                </div>
                <p className="text-xs text-charcoal/45 truncate">
                  {member.homeCity ?? member.email}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
