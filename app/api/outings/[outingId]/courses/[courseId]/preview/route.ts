import { coursePreviewResponse } from "@/modules/providers/course-preview-response";
import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/auth";
import { getOutingDetail } from "@/modules/outings/service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ outingId: string; courseId: string }> },
) {
  const profile = await requireProfile();
  const { outingId, courseId } = await params;
  const detail = await getOutingDetail(outingId, profile.id);
  const course = detail?.golfCourses.find((c) => c.id === courseId);
  if (!detail || !course)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return coursePreviewResponse(course);
}
