import { cookies } from "next/headers";

const DEMO_SESSION_COOKIE = "outing_demo_session";

export async function setDemoSession(profileId: string) {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, profileId, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });
}

export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
}

export async function getDemoSessionProfileId() {
  const cookieStore = await cookies();
  return cookieStore.get(DEMO_SESSION_COOKIE)?.value ?? null;
}
