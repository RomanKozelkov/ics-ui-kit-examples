import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "ics-ui-kit/components/select";
import { Field } from "ics-ui-kit/components/field";
import type { RequestBody } from "../types";

interface RequestBodyBlockProps {
	requestBody: RequestBody;
}

export function RequestBodyBlock({ requestBody }: RequestBodyBlockProps) {
	return (
		<div className="space-y-4">
			<h3 className="font-medium text-primary-fg">Тело запроса</h3>

			<Field
				title="Тип содержимого"
				layout="vertical"
				control={({ id }) => (
					<Select defaultValue={requestBody.contentTypes[0] ?? ""}>
						<SelectTrigger id={id} className="w-48">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{requestBody.contentTypes.map((ct) => (
								<SelectItem key={ct} value={ct}>
									{ct}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>

			<pre className="overflow-x-auto rounded-lg border border-secondary-border bg-secondary-bg-hover p-4 font-mono text-xs text-primary-fg">
				{requestBody.example}
			</pre>
		</div>
	);
}
