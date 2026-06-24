import { TableHead, TableHeader, TableRow } from "ics-ui-kit/components/table";

const COLUMN_WIDTHS = ["w-48", "w-auto", "w-64"];

export function ParametersTableHead({ columns }: { columns: string[] }) {
	return (
		<TableHeader>
			<TableRow>
				{columns.map((col, i) => (
					<TableHead key={col} className={`px-4 py-3 text-muted ${COLUMN_WIDTHS[i] ?? ""}`}>
						{col}
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
	);
}
