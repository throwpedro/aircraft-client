const API_BASE_URL = "http://localhost:5156/api";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T | void> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `API error: ${res.status}: Message: ${errorText || "Unknown error"}`,
    );
  }

  if (res.status === 204) {
    return;
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : undefined;
}
