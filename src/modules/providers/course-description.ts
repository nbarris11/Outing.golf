import https from "node:https";
import { lookup } from "node:dns/promises";
import { BlockList } from "node:net";

const blocked = new BlockList();
for (const [address, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.168.0.0", 16],
  ["192.0.0.0", 24],
  ["198.18.0.0", 15],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const)
  blocked.addSubnet(address, prefix, "ipv4");
export function extractCourseDescription(html: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (
      !/(?:name|property)\s*=\s*["'](?:description|og:description)["']/i.test(
        tag,
      )
    )
      continue;
    const content = tag.match(/content\s*=\s*(["'])(.*?)\1/i)?.[2];
    if (!content) continue;
    const text = content
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, "")
      .trim();
    if (text.length >= 35) return text.slice(0, 450);
  }
  return null;
}
/** Read only the public HTTPS website returned by Places; pin DNS and cap response size. */
export async function courseWebsiteDescription(
  website: string,
  redirects = 0,
): Promise<string | null> {
  try {
    const url = new URL(website);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      (url.port && url.port !== "443")
    )
      return null;
    const records = await lookup(url.hostname, { family: 4, all: true });
    const address = records[0]?.address;
    if (!address || records.some((r) => blocked.check(r.address, "ipv4")))
      return null;
    return await new Promise((resolve) => {
      const req = https.get(
        url,
        {
          family: 4,
          timeout: 3500,
          headers: {
            "User-Agent": "OutingGolf/1.0 (course preview)",
            Accept: "text/html",
          },
          lookup: (_hostname, _options, cb) => cb(null, address, 4),
        },
        (res) => {
          if (
            res.statusCode &&
            [301, 302, 307, 308].includes(res.statusCode) &&
            res.headers.location &&
            redirects < 2
          ) {
            res.resume();
            resolve(
              courseWebsiteDescription(
                new URL(res.headers.location, url).href,
                redirects + 1,
              ),
            );
            return;
          }
          if (
            res.statusCode !== 200 ||
            !res.headers["content-type"]?.includes("text/html")
          ) {
            res.resume();
            resolve(null);
            return;
          }
          let body = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            body += chunk;
            if (body.length > 200_000 || body.includes("</head>")) {
              resolve(extractCourseDescription(body));
              req.destroy();
            }
          });
          res.on("end", () => resolve(extractCourseDescription(body)));
          res.on("error", () => resolve(null));
        },
      );
      req.on("timeout", () => {
        req.destroy();
        resolve(null);
      });
      req.on("error", () => resolve(null));
    });
  } catch {
    return null;
  }
}
