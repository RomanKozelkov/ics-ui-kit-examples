import type { TabularRequest, TabularResponse } from "./types";

export class MdtApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly statusText: string,
		public readonly body: unknown,
		public readonly url: string
	) {
		super(`MDT API ${status} ${statusText} @ ${url}`);
		this.name = "MdtApiError";
	}
}

export type MdtApiClient = {
	tabularFetch: (body: TabularRequest) => Promise<TabularResponse>;
	rawFetch: <T = unknown>(query: unknown) => Promise<T>;
};

export function createMdtApiClient(baseUrl: string): MdtApiClient {
	async function request<T>(path: string, body: unknown): Promise<T> {
		const url = `${baseUrl}${path}`;

		let res: Response;
		try {
			res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(body)
			});
		} catch (e) {
			if (e instanceof DOMException && e.name === "AbortError") throw e;
			throw new MdtApiError(0, "Network Error", e instanceof Error ? e.message : String(e), url);
		}

		if (!res.ok) {
			const errBody = await res.json().catch(() => null);
			throw new MdtApiError(res.status, res.statusText, errBody, url);
		}

		return res.json() as Promise<T>;
	}

	return {
		tabularFetch: (body) => request<TabularResponse>("/tabular/fetch", body),
		rawFetch: <T>(query: unknown) => request<T>("/fetch", query)
	};
}
