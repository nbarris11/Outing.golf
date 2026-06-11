import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Outing.golf — golf trip planner for groups";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background:
            "radial-gradient(900px 500px at 12% 0%, rgba(217,200,167,0.42), transparent 55%), radial-gradient(800px 600px at 95% 100%, rgba(20,58,44,0.18), transparent 60%), #f7f4ee",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 96px",
          fontFamily: "Georgia, serif",
          color: "#212423"
        }}
      >
        {/* Wordmark with hole + flag mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#143a2c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <svg width="36" height="36" viewBox="0 0 44 44">
              <ellipse cx="22" cy="30" rx="11" ry="3.2" fill="#0a1812" />
              <rect x="21" y="10" width="2" height="20" rx="1" fill="#F7F4EE" />
              <path d="M23 11 L34 14 L23 17 Z" fill="#C8932E" />
            </svg>
          </div>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", color: "#212423", fontFamily: "system-ui, sans-serif" }}>
            Outing<span style={{ color: "#C8932E" }}>.</span>golf
          </div>
        </div>

        {/* H1 */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            letterSpacing: "-0.05em",
            lineHeight: 0.98,
            maxWidth: 980,
            color: "#143a2c"
          }}
        >
          Get your group to Bandon this fall.
        </div>

        {/* Sub */}
        <div
          style={{
            marginTop: 28,
            fontSize: 24,
            color: "rgba(33,36,35,0.65)",
            maxWidth: 780,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1.4
          }}
        >
          One link to the group, one shared Trip HQ when the plan locks in.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
