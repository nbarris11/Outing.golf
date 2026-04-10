export function logInfo(message: string, context?: Record<string, unknown>) {
  console.info(`[outing.golf] ${message}`, context ?? {});
}

export function logError(message: string, error: unknown, context?: Record<string, unknown>) {
  console.error(`[outing.golf] ${message}`, {
    ...(context ?? {}),
    error: error instanceof Error ? error.message : error
  });
}
