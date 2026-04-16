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
          background: "linear-gradient(135deg, #143a2c 0%, #1e5a42 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          color: "#f7f4ee"
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            background: "rgba(247,244,238,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: 32
          }}
        >
          O
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            marginBottom: 16
          }}
        >
          Outing.golf
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(247,244,238,0.7)",
            letterSpacing: "0.01em",
            textAlign: "center",
            maxWidth: 700
          }}
        >
          Golf trip planner for groups
        </div>

        {/* Bottom descriptor */}
        <div
          style={{
            marginTop: 40,
            padding: "12px 28px",
            borderRadius: 999,
            background: "rgba(247,244,238,0.12)",
            fontSize: 18,
            color: "rgba(247,244,238,0.6)",
            letterSpacing: "0.12em",
            textTransform: "uppercase"
          }}
        >
          Collect dates · budgets · votes in one place
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
