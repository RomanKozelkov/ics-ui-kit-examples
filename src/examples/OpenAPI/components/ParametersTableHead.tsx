import { TableHead, TableHeader, TableRow } from "ics-ui-kit/components/table";

export function ParametersTableHead({ columns }: { columns: string[] }) {
	return (
		<TableHeader>
			<TableRow>
				{columns.map((col) => (
					<TableHead key={col} className="px-4 py-3 text-muted">
						{col}
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
	);
}
