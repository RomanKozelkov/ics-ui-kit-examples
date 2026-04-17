const API_URL = "https://modules-dev.ics-it.ru/typification/api/v2/fetch";

async function post<T>(body: unknown): Promise<T> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getDirectCompany() {
    return post<unknown>({ table: "md.DirectCompany" });
  },
};
