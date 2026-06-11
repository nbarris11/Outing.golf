import type { Metadata } from "next";

export const SITE_URL = "https://www.outing.golf";
export const SITE_NAME = "Outing.golf";

/**
 * Builds page metadata with a self-referencing canonical and page-specific
 * Open Graph + Twitter tags. Without the per-page openGraph block, every page
 * inherits the root layout's og:url/og:title, which breaks link previews for
 * any shared content page.
 */
export function buildMetadata({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
