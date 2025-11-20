// src/lib/api.ts
export const api = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.warn("API lỗi:", url, res.status, data);
    // Không throw → không crash app
    return data as T;
  }

  return data as T;
};