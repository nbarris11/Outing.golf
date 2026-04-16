import { ImageResponse } from "next/og";

import { resolveOutingIdFromShareToken } from "@/lib/outing-share-links";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const outingId = await resolveOutingIdFromShareToken(token);

  let tripName = "Golf Trip";
  let destination = "";
  let playerCount: number | null = null;

  if (outingId) {
    const adminClient = createSupabaseAdminClient();
    if (adminClient) {
      const { data } = await adminClient
        .from("outings")
        .select("name,destination_label,number_of_players")
        .eq("id", outingId)
        .maybeSingle();

      if (data) {
        tripName = data.name ?? tripName;
        destination = data.destination_label ?? "";
        playerCount = data.number_of_players ?? null;
      }
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #143a2c 0%, #2d473c 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "60px 72px",
          fontFamily: "Georgia, serif"
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "auto"
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#f7f4ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#143a2c",
              fontSize: "18px",
              fontWeight: "700"
            }}
          >
            O
          </div>
          <span
            style={{
              color: "#f7f4ee",
              fontSize: "22px",
              fontWeight: "600",
              letterSpacing: "-0.02em"
            }}
          >
            Outing.golf
          </span>
        </div>

        {/* Trip name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              color: "rgba(247,244,238,0.55)",
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "Helvetica, Arial, sans-serif"
            }}
          >
            You&apos;re invited to a golf trip
          </div>
          <div
            style={{
              color: "#f7f4ee",
              fontSize: tripName.length > 30 ? "56px" : "68px",
              fontWeight: "700",
              lineHeight: "1",
              letterSpacing: "-0.04em"
            }}
          >
            {tripName}
          </div>

          {/* Details row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginTop: "8px",
              fontFamily: "Helvetica, Arial, sans-serif"
            }}
          >
            {destination && (
              <span
                style={{
                  color: "rgba(247,244,238,0.72)",
                  fontSize: "22px",
                  fontWeight: "400"
                }}
              >
                {destination}
              </span>
            )}
            {playerCount && (
              <>
                {destination && (
                  <span style={{ color: "rgba(247,244,238,0.3)", fontSize: "22px" }}>·</span>
                )}
                <span
                  style={{
                    color: "rgba(247,244,238,0.72)",
                    fontSize: "22px",
                    fontWeight: "400"
                  }}
                >
                  {playerCount} golfers
                </span>
              </>
            )}
          </div>
        </div>

        {/* Golf flag SVG — bottom right */}
        <svg
          style={{ position: "absolute", bottom: "48px", right: "72px", opacity: 0.2 }}
          width="120"
          height="160"
          viewBox="0 0 120 160"
          fill="none"
        >
          <rect x="18" y="20" width="4" height="130" fill="#f7f4ee" rx="2" />
          <path d="M22 20 L90 42 L22 64 Z" fill="#f7f4ee" />
          <ellipse cx="20" cy="152" rx="28" ry="6" fill="#f7f4ee" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
