import { ImageResponse } from "next/og";

import { getBrandLogoDataUrl } from "@/lib/brand-image";

export const runtime = "nodejs";
export const alt = "Outing.golf — golf trip planner for groups";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logo = await getBrandLogoDataUrl();
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#f7f4ee",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 96px",
          fontFamily: "Georgia, serif",
          color: "#212423"
        }}
      >
        <img src={logo} alt="Outing.golf" width={340} height={67} style={{ marginBottom: 40 }} />

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
