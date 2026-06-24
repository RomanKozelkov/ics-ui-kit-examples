import { useState } from "react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { Button } from "ics-ui-kit/components/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "ics-ui-kit/components/collapsible";
import type { Endpoint, HttpMethod } from "../types";
// import { ParametersTable } from "./ParametersTable";
// import { ResponsesTable } from "./ResponsesTable";
// import { RequestBodyBlock } from "./RequestBodyBlock";
import { Icon } from "ics-ui-kit/components/icon";
import { Badge } from "ics-ui-kit/components/badge";
import { BadgeProps } from "ics-ui-kit/components/badge/Badge";

export const METHOD_STATUS: Record<HttpMethod, BadgeProps["status"]> = {
	GET: "info",
	POST: "success",
	PUT: "warning",
	DELETE: "error",
	PATCH: "default"
};

interface EndpointCardProps {
	endpoint: Endpoint;
}

export function EndpointCard({ endpoint }: EndpointCardProps) {
	const [open, setOpen] = useState(false);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<div className="overflow-hidden rounded-xl border border-secondary-border shadow-soft-sm">
				<CollapsibleTrigger asChild>
					<div className="flex h-12 w-full items-center gap-3 bg-primary-bg px-4 py-2.5 text-left hover:cursor-pointer hover:bg-secondary-bg-hover">
						{open ? (
							<Icon icon={ChevronUp} className="shrink-0 text-muted" />
						) : (
							<Icon icon={ChevronDown} className="shrink-0 text-muted" />
						)}
						<Badge status={METHOD_STATUS[endpoint.method]}>{endpoint.method}</Badge>
						<span className="text-base font-medium text-primary-fg">{endpoint.path}</span>
						<span className="flex-1 text-sm text-muted">{endpoint.summary}</span>
						{endpoint.authLocked && (
							<Button variant="outline" size="xs" startIcon={Lock}>
								Авторизоваться
							</Button>
						)}
					</div>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<div className="space-y-6 border-t border-primary-border bg-primary-bg px-4 py-5">
						{endpoint.description && <p className="text-sm text-muted">{endpoint.description}</p>}
						{/* {endpoint.parameters.length > 0 && <ParametersTable parameters={endpoint.parameters} />}
						{endpoint.requestBody && <RequestBodyBlock requestBody={endpoint.requestBody} />}
						<ResponsesTable responses={endpoint.responses} /> */}
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}
