export type TabularColumnRef = { column: { table: string; name: string } };

export type TabularFilter =
	| { op: "and" | "or"; groups: TabularFilter[] }
	| { op: "eq"; column: { table: string; name: string }; value: string | number }
	| { op: "in"; column: { table: string; name: string }; list: Array<string | number> }
	| { op: "contains"; column: { table: string; name: string }; value: string }
	| { op: "le" | "ge" | "lt" | "gt"; column: { table: string; name: string }; value: number | string };

export type TabularRequest = {
	select: TabularColumnRef[];
	filter: TabularFilter;
	take: number;
	skip: number;
};

export type TabularRawRow = Record<string, string | number>;
export type TabularResponse = { payload: { rows: TabularRawRow[] } };
