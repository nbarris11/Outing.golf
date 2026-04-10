import { env } from "@/lib/env";
import { logError } from "@/lib/logger";

import { LiteApiRequestError } from "./types";

const DEFAULT_TIMEOUT_MS = 12000;

function stripSecrets(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stripSecrets);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      if (/(api.?key|token|card|cvc|secret|number)/i.test(key)) {
        return [key, "[redacted]"];
      }

      return [key, stripSecrets(entry)];
    })
  );
}

export async function liteApiFetchJson<T>(
  path: string,
  input?: {
    method?: "GET" | "POST";
    baseUrl?: string;
    body?: Record<string, unknown>;
    timeoutMs?: number;
  }
) {
  if (!env.LITEAPI_API_KEY) {
    throw new LiteApiRequestError({
      message: "LiteAPI is not configured",
      status: 500,
      path,
      code: "liteapi_not_configured"
    });
  }

  const controller = new AbortController();
  const timeoutMs = input?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const baseUrl = input?.baseUrl ?? env.LITEAPI_BASE_URL;
  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url, {
      method: input?.method ?? "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": env.LITEAPI_API_KEY
      },
      body: input?.body ? JSON.stringify(input.body) : undefined,
      cache: "no-store",
      signal: controller.signal
    });

    const rawText = await response.text();
    let parsed: unknown = null;

    if (rawText) {
      try {
        parsed = JSON.parse(rawText);
      } catch (error) {
        logError("LiteAPI returned invalid JSON", error, {
          path,
          status: response.status
        });
      }
    }

    if (!response.ok) {
      const parsedRecord = parsed as Record<string, unknown> | null;
      const errorRecord = parsedRecord ? (parsedRecord.error as Record<string, unknown> | undefined) : undefined;
      const message =
        parsedRecord?.message?.toString() ??
        errorRecord?.message?.toString() ??
        errorRecord?.description?.toString() ??
        `LiteAPI request failed with status ${response.status}`;

      const requestError = new LiteApiRequestError({
        message,
        status: response.status,
        path,
        code: parsedRecord?.code?.toString() ?? errorRecord?.code?.toString(),
        details: stripSecrets(parsed)
      });

      logError("LiteAPI request failed", requestError, {
        path,
        status: response.status,
        response: stripSecrets(parsed),
        body: stripSecrets(input?.body)
      });

      throw requestError;
    }

    return parsed as T;
  } catch (error) {
    if (error instanceof LiteApiRequestError) {
      throw error;
    }

    const requestError = new LiteApiRequestError({
      message:
        error instanceof Error && error.name === "AbortError"
          ? `LiteAPI request timed out after ${timeoutMs}ms`
          : error instanceof Error
            ? error.message
            : "Unknown LiteAPI request failure",
      status: 500,
      path,
      code: error instanceof Error && error.name === "AbortError" ? "timeout" : undefined,
      details: undefined
    });

    logError("LiteAPI request crashed", error, {
      path,
      body: stripSecrets(input?.body)
    });

    throw requestError;
  } finally {
    clearTimeout(timeoutId);
  }
}
