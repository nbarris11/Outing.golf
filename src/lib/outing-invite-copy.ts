export function buildOutingInviteCopy(outingName: string, destination: string | undefined, shareLink: string) {
  const location = destination?.trim();
  const message = `You're invited to ${outingName}${location ? ` — ${location}` : ""}. Add your dates and budget so we can get this trip booked.`;
  return {
    title: `Join ${outingName}`,
    message,
    withLink: `${message}\n\n${shareLink}`
  };
}
