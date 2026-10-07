import { NextResponse } from "next/server";
import { getInvitation } from "@/lib/invitation";
import { coursePreviewResponse } from "@/modules/providers/course-preview-response";
export async function GET(
  _request: Request,
  {
    params,
  }: { params: Promise<{ kind: string; token: string; courseId: string }> },
) {
  const { kind, token, courseId } = await params;
  if (kind !== "join" && kind !== "invite")
    return NextResponse.json({}, { status: 404 });
  const invite = await getInvitation(token, kind);
  const course = invite?.courses.find((c) => c.id === courseId);
  if (!course) return NextResponse.json({}, { status: 404 });
  return coursePreviewResponse(course);
}
