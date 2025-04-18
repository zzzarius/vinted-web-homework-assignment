import { sleep } from "../utils.ts";

export async function authorizedFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<{
  data: T | null;
  errors: unknown[];
  hasErrors: boolean;
}> {
  const errors: unknown[] = [];
  if (!import.meta.env.VITE_PEXELS_API_KEY) {
    errors.push(
      "Environment variable VITE_PEXELS_API_KEY is not defined. Check your .env file.",
    );
  }
  try {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
    const headers = {
      ...(init?.headers || {}),
      Authorization: apiKey,
    };
    const response = await fetch(input, { ...init, headers });
    const data = await response.json();
    return { data, errors, hasErrors: false };
  } catch (err: unknown) {
    errors.push(err instanceof Error ? err.message : String(err));
    await sleep(5000);
  }
  return { data: null, errors, hasErrors: true };
}
