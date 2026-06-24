import { useState } from "react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "ics-ui-kit/components/select";
import type { ResponseCode } from "../types";

interface ResponseRowProps {
	response: ResponseCode;
}

export function ResponseRow({ response }: ResponseRowProps) {
	const [selectedContentType, setSelectedContentType] = useState<string>(
		response.contentTypes?.[0] ?? ""
	);
	const [selectedExample, setSelectedExample] = useState<string>(
		response.examples?.[0]?.label ?? ""
	);
	const [view, setView] = useState<"example" | "schema">("example");

	const currentExample = response.examples?.find((ex) => ex.label === selectedExample);

	return (
		<tr className="border-b border-primary-border last:border-0">
			<td className="py-4 pr-8 align-top text-sm text-primary-fg">{response.code}</td>
			<td className="py-4 align-top">
				<p className="mb-3 text-sm text-primary-fg">{response.description}</p>

				{response.contentTypes && (
					<div className="flex flex-wrap items-end gap-4">
						<div>
							<div className="mb-1 text-xs text-muted">Тип содержимого</div>
							<Select value={selectedContentType} onValueChange={setSelectedContentType}>
								<SelectTrigger className="w-48">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{response.contentTypes.map((ct) => (
										<SelectItem key={ct} value={ct}>
											{ct}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{response.acceptHelper && (
								<p className="mt-1 text-xs text-muted">Задаёт заголовок Accept.</p>
							)}
						</div>

						{response.examples && response.examples.length > 0 && (
							<div>
								<div className="mb-1 text-xs text-muted">Примеры</div>
								<Select value={selectedExample} onValueChange={setSelectedExample}>
									<SelectTrigger className="w-48">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{response.examples.map((ex) => (
											<SelectItem key={ex.label} value={ex.label}>
												{ex.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
				)}

				{(response.examples || response.schema) && (
					<div className="mt-3">
						<div className="mb-2 flex gap-3 text-sm">
							{response.examples && (
								<button
									className={view === "example" ? "font-semibold text-primary-fg" : "text-muted underline"}
									onClick={() => setView("example")}
								>
									Пример значения
								</button>
							)}
							{response.schema && response.examples && (
								<span className="text-muted">|</span>
							)}
							{response.schema && (
								<button
									className={view === "schema" ? "font-semibold text-primary-fg" : "text-muted underline"}
									onClick={() => setView("schema")}
								>
									Схема
								</button>
							)}
						</div>

						{view === "example" && currentExample && (
							<pre className="overflow-x-auto rounded-lg bg-secondary-bg-hover p-4 font-mono text-xs text-primary-fg">
								{currentExample.json}
							</pre>
						)}

						{view === "schema" && response.schema && (
							<div className="rounded-lg bg-secondary-bg-hover p-4">
								<div className="mb-1 text-xs text-muted">type: {response.schema.type}</div>
								{response.schema.fields && (
									<table className="w-full">
										<tbody>
											{response.schema.fields.map((field) => (
												<tr key={field.name}>
													<td className="py-0.5 pr-4 font-mono text-xs font-medium text-primary-fg">
														{field.name}
													</td>
													<td className="py-0.5 text-xs text-muted">{field.type}</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
							</div>
						)}
					</div>
				)}
			</td>
		</tr>
	);
}
