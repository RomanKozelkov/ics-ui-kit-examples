import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "ics-ui-kit/components/collapsible";
import type { ApiGroup } from "../types";
import { EndpointCard } from "./EndpointCard";
import { Icon } from "ics-ui-kit/components/icon";
import { Counter } from "ics-ui-kit/components/counter";

interface ApiGroupSectionProps {
	group: ApiGroup;
}

export function ApiGroupSection({ group }: ApiGroupSectionProps) {
	const [open, setOpen] = useState(true);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger asChild>
				<div className="flex w-full items-center gap-3 py-2 text-left hover:cursor-pointer hover:opacity-80">
					{open ? (
						<Icon icon={ChevronUp} className="shrink-0 text-muted" />
					) : (
						<Icon icon={ChevronDown} className="shrink-0 text-muted" />
					)}
					<span className="text-lg font-bold">{group.tag}</span>
					<Counter variant="secondary" className="rounded-full">
						{group.endpoints.length}
					</Counter>
					<span className="text-sm text-muted">{group.description}</span>
				</div>
			</CollapsibleTrigger>

			<CollapsibleContent>
				<div className="mt-2 space-y-3">
					{group.endpoints.map((endpoint) => (
						<EndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
					))}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
