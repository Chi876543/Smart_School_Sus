// ssb-frontend/lib/api.ts → PHẢI LÀ DÒNG NÀY, KHÔNG ĐƯỢC LÀ localhost:3000 hay 3001
const API_BASE = "/api";   // ← ĐÚNG

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  console.log("Calling API:", url); // ← thêm dòng này để debug

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Lỗi server" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}