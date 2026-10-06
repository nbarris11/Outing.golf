"use client";
import { useEffect, useRef, useState } from "react";
import type { GolfCourseOption } from "@/types/domain";
type Preview = {
  description?: string;
  descriptionSource?: string;
  photoUrl?: string;
  attribution?: string;
  website?: string;
  maps?: string;
  rating?: number;
  reviews?: number;
};
export function CoursePreview({
  outingId,
  course,
}: {
  outingId: string;
  course: GolfCourseOption;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Preview>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      observer.disconnect();
      fetch(`/api/outings/${outingId}/courses/${course.id}/preview`, {
        signal: controller.signal,
      })
        .then((r) => (r.ok ? r.json() : {}))
        .then(setData)
        .catch(() => {})
        .finally(() => setLoading(false));
    });
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      controller.abort();
    };
  }, [outingId, course.id]);
  const query = encodeURIComponent(`${course.name} ${course.locationLabel}`);
  return (
    <div
      ref={root}
      className="mt-3 overflow-hidden rounded-2xl border border-charcoal/10 bg-white"
    >
      {data.photoUrl && (
        <figure>
          <img
            src={data.photoUrl}
            alt={course.name}
            className="h-48 w-full object-cover"
            loading="lazy"
          />
          <figcaption className="px-4 py-1 text-xs text-charcoal/60">
            Photo: {data.attribution || "Google Maps"}
          </figcaption>
        </figure>
      )}
      <div className="p-4">
        <h4 className="font-serif text-xl">{course.name}</h4>
        <p className="mt-1 text-sm text-charcoal/60">{course.locationLabel}</p>
        <p className="mt-3 text-sm">
          {data.description ||
            course.summary ||
            (loading
              ? "Loading course details…"
              : "A description is not available for this course yet. Check the course website for layouts and visitor access.")}
        </p>
        {data.description && (
          <p className="mt-1 text-xs text-charcoal/50">
            About this course · {data.descriptionSource}
          </p>
        )}
        {data.rating && (
          <p className="mt-2 text-xs">
            Google Maps · {data.rating}/5 · {data.reviews ?? 0} reviews
          </p>
        )}
        <p className="mt-2 text-xs text-charcoal/60">
          Confirm visitor access, walking rules, and rates for your date with
          the course.
        </p>
        {data.website && (
          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm underline"
          >
            Course website ↗
          </a>
        )}
      </div>
      <iframe
        title={`Map of ${course.name}`}
        src={`https://maps.google.com/maps?q=${query}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-56 w-full border-0"
      />
      <a
        href={
          data.maps ||
          `https://www.google.com/maps/search/?api=1&query=${query}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 text-sm underline"
      >
        Open directions in Google Maps ↗
      </a>
    </div>
  );
}
