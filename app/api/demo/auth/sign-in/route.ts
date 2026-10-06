import { NextResponse } from "next/server";

import { getDemoProfileByEmail } from "@/lib/demo/store";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "");
  const destination = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  const profile = await getDemoProfileByEmail(email);

  if (!profile) {
    return new NextResponse(null, {
      status: 303,
      headers: {
        Location: "/sign-in?error=Demo%20account%20not%20found"
      }
    });
  }

  const response = new NextResponse(null, {
    status: 303,
    headers: {
    Location: destination
    }
  });
  response.cookies.set("outing_demo_session", profile.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/"
  });

  return response;
}
