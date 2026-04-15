import { createHash } from "node:crypto";

import { env } from "@/lib/env";
import { logError } from "@/lib/logger";

import { HotelBedsRequestError } from "./types";

const DEFAULT_TIMEOUT_MS = 12000;

export function generateSignature(apiKey: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return createHash("sha256").update(apiKey + secret + timestamp).digest("hex");
}

export async function hotelBedsFetch<T>(
  path: string,
  options?: {
    method?: "GET" | "POST";
    body?: Record<string, unknown>;
    timeoutMs?: number;
  }
): Promise<T> {
  const apiKey = env.HOTELBEDS_API_KEY;

  if (!apiKey) {
    throw new HotelBedsRequestError({
      message: "HotelBeds is not configured",
      status: 500,
      path,
      code: "hotelbeds_not_configured"
    });
  }

  const secret = env.HOTELBEDS_SECRET ?? "";
  const signature = generateSignature(apiKey, secret);
  const baseUrl = env.HOTELBEDS_BASE_URL;
  const url = `${baseUrl}${path}`;
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: options?.method ?? "GET",
      headers: {
        "Api-key": apiKey,
        "X-Signature": signature,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
      signal: controller.signal
    });

    const rawText = await response.text();
    let parsed: unknown = null;

    if (rawText) {
      try {
        parsed = JSON.parse(rawText);
      } catch (error) {
        logError("HotelBeds returned invalid JSON", error, {
          path,
          status: response.status
        });
      }
    }

    if (!response.ok) {
      const parsedRecord = parsed as Record<string, unknown> | null;
      const errorRecord = parsedRecord?.error as Record<string, unknown> | undefined;
      const message =
        parsedRecord?.message?.toString() ??
        errorRecord?.message?.toString() ??
        errorRecord?.description?.toString() ??
        `HotelBeds request failed with status ${response.status}`;

      const requestError = new HotelBedsRequestError({
        message,
        status: response.status,
        path,
        code: parsedRecord?.code?.toString() ?? errorRecord?.code?.toString(),
        details: parsed
      });

      logError("HotelBeds request failed", requestError, {
        path,
        status: response.status,
        response: parsed
      });

      throw requestError;
    }

    return parsed as T;
  } catch (error) {
    if (error instanceof HotelBedsRequestError) {
      throw error;
    }

    const requestError = new HotelBedsRequestError({
      message:
        error instanceof Error && error.name === "AbortError"
          ? `HotelBeds request timed out after ${timeoutMs}ms`
          : error instanceof Error
            ? error.message
            : "Unknown HotelBeds request failure",
      status: 500,
      path,
      code: error instanceof Error && error.name === "AbortError" ? "timeout" : undefined
    });

    logError("HotelBeds request crashed", error, { path });

    throw requestError;
  } finally {
    clearTimeout(timeoutId);
  }
}
