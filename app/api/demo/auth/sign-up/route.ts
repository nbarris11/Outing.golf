import { NextResponse } from "next/server";

import { createDemoUser } from "@/lib/demo/store";

export async function POST(request: Request) {
  const formData = await request.formData();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "");
  const destination = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (!fullName || !email) {
    return new NextResponse(null, {
      status: 303,
      headers: {
        Location: "/sign-up?error=Missing%20required%20fields"
      }
    });
  }

  const profile = await createDemoUser(email, fullName);
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
