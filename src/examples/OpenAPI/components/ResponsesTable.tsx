import type { ResponseCode } from "../types";
import { ResponseRow } from "./ResponseRow";

interface ResponsesTableProps {
	responses: ResponseCode[];
}

export function ResponsesTable({ responses }: ResponsesTableProps) {
	return (
		<div className="space-y-4">
			<h3 className="font-medium text-primary-fg">Ответы сервера</h3>

			<table className="w-full">
				<thead>
					<tr className="border-b border-primary-border">
						<th className="pb-3 pr-8 text-left text-sm font-semibold text-primary-fg">Код</th>
						<th className="pb-3 text-left text-sm font-semibold text-primary-fg">Описание</th>
					</tr>
				</thead>
				<tbody>
					{responses.map((response) => (
						<ResponseRow key={response.code} response={response} />
					))}
				</tbody>
			</table>
		</div>
	);
}
