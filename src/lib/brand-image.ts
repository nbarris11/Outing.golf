import { readFile } from "node:fs/promises";
import path from "node:path";

// Embed the bundled logo so sharing images never depend on a network fetch.
export async function getBrandLogoDataUrl() {
  const logo = await readFile(path.join(process.cwd(), "public/brand/outing-logo.png"));
  return `data:image/png;base64,${logo.toString("base64")}`;
}
