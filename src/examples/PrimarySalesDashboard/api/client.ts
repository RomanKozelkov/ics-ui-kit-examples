export type TabularRequest = {
	select: Array<{ column: { table: string; name: string } }>;
	filter?: unknown;
	take?: number;
	skip?: number;
};

export type TabularRow = Record<string, number | string | null>;

export type TabularResponse = {
	rows: TabularRow[];
};

export async function tabularFetch(_body: TabularRequest): Promise<TabularResponse> {
	throw new Error("tabularFetch: real endpoint not wired yet");
}
