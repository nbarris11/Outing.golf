import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { siteAccessPassword } from "@/lib/env";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!siteAccessPassword || password !== siteAccessPassword) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("outing_site_access_error", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60
    });
    return response;
  }

  const response = NextResponse.redirect(new URL(redirectTo.startsWith("/") ? redirectTo : "/", request.url));

  response.cookies.set("outing_site_access", "granted", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  response.cookies.set("outing_site_access_error", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 0
  });

  return response;
}
