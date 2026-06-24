import React from "react";
import { TextInput } from "ics-ui-kit/components/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "ics-ui-kit/components/select";
import { TableRow, TableCell } from "ics-ui-kit/components/table";
import type { Parameter } from "../types";
import { Badge } from "ics-ui-kit/components/badge";

interface ParameterRowProps {
	param: Parameter;
	mode?: "info" | "execute";
	value: string;
	onChange: (value: string) => void;
}

export function ParameterRow({ param, mode = "info", value, onChange }: ParameterRowProps) {
	const hasOptions = param.options && param.options.length > 0;

	return (
		<TableRow>
			<TableCell className="px-4 py-3 align-top">
				<div className="flex items-center gap-1">
					<span className="font-medium text-primary-fg">{param.name}</span>
					{param.required && <span className="text-xs text-status-error">*</span>}
					<Badge status="info" size="sm" className="ml-1">
						{param.location}
					</Badge>
				</div>
				<div className="font-mono text-xs font-medium text-muted">{param.type}</div>
			</TableCell>

			<TableCell className="px-4 py-3 align-top text-sm text-muted">
				{param.description}
				{param.defaultValue && (
					<div className="text-xs italic text-muted">По умолчанию: {param.defaultValue}</div>
				)}
			</TableCell>

			{mode === "execute" && (
				<TableCell className="px-4 py-3 align-top">
					{hasOptions ? (
						<Select value={value} onValueChange={onChange}>
							<SelectTrigger className="w-52">
								<SelectValue
									placeholder={
										param.options!.find((o) => o.value === "")?.label ?? param.options![0].label
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{param
									.options!.filter((opt) => opt.value !== "")
									.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					) : (
						<TextInput
							className="w-52"
							value={value}
							onChange={(value) => onChange(value ?? "")}
							placeholder={param.placeholder ?? String(param.defaultValue ?? "")}
						/>
					)}
				</TableCell>
			)}
		</TableRow>
	);
}
