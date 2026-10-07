export function buildOutingInviteCopy(outingName: string, destination: string | undefined, shareLink: string) {
  const location = destination?.trim();
  const message = `You're invited to ${outingName}${location ? ` — ${location}` : ""}. Take a look at the courses, dates, and cost, then let us know if you can make it.`;
  return {
    title: `Join ${outingName}`,
    message,
    withLink: `${message}\n\n${shareLink}`
  };
}
