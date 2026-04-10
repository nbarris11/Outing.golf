import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = new NextResponse(null, {
    status: 303,
    headers: {
      Location: "/"
    }
  });
  response.cookies.delete("outing_demo_session");
  return response;
}
