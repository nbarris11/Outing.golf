import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/outings/", "/api/", "/auth/", "/join/"]
    },
    sitemap: "https://www.outing.golf/sitemap.xml"
  };
}
