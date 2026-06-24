import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "ics-ui-kit/components/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "ics-ui-kit/components/tabs";
import { Table, TableBody } from "ics-ui-kit/components/table";
import type { Parameter } from "../types";
import { ParameterRow } from "./ParameterRow";
import { Icon } from "ics-ui-kit/components/icon";
import { ParametersTableHead } from "./ParametersTableHead";

interface ParametersTableProps {
	parameters: Parameter[];
}

export function ParametersTable({ parameters }: ParametersTableProps) {
	const [values, setValues] = useState<Record<string, string>>(() => makeDefaults(parameters));

	return (
		<Tabs defaultValue="description">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="font-medium text-primary-fg">Параметры</h3>

				<TabsList>
					<TabsTrigger value="description">Описание</TabsTrigger>
					<TabsTrigger value="execute">
						<Icon icon={Play} />
						Выполнить
					</TabsTrigger>
				</TabsList>
			</div>

			<TabsContent value="description">
				<div className="rounded-xl border border-secondary-border focus-visible:outline-none">
					<Table className="table-fixed">
						<ParametersTableHead columns={["Параметр", "Описание"]} />
						<TableBody>
							{parameters.map((param) => (
								<ParameterRow
									key={param.name}
									param={param}
									mode="info"
									value={values[param.name] ?? ""}
									onChange={(v) => setValues((prev) => ({ ...prev, [param.name]: v }))}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			</TabsContent>

			<TabsContent value="execute">
				<div className="rounded-xl border border-secondary-border focus-visible:outline-none">
					<Table className="table-fixed">
						<ParametersTableHead columns={["Параметр", "Описание", "Значение"]} />
						<TableBody>
							{parameters.map((param) => (
								<ParameterRow
									key={param.name}
									param={param}
									mode="execute"
									value={values[param.name] ?? ""}
									onChange={(v) => setValues((prev) => ({ ...prev, [param.name]: v }))}
								/>
							))}
						</TableBody>
					</Table>
				</div>

				<div className="mt-4 flex justify-end gap-2">
					<Button variant="outline" size="sm" onClick={() => setValues(makeDefaults(parameters))}>
						Сбросить
					</Button>
					<Button size="sm" startIcon={Play}>
						Выполнить запрос
					</Button>
				</div>
			</TabsContent>
		</Tabs>
	);
}

function makeDefaults(parameters: Parameter[]): Record<string, string> {
	return Object.fromEntries(parameters.map((p) => [p.name, String(p.defaultValue ?? "")]));
}
