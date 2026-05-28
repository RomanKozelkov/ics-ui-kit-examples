import { useState } from "react";
import { TriggerButton } from "ics-ui-kit/components/button";
import { Icon } from "ics-ui-kit/components/icon";
import { Popover, PopoverContent, PopoverTrigger } from "ics-ui-kit/components/popover";
import { cn } from "ics-ui-kit/lib/utils";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { FilterDistr } from "./FilterDistr";
import { FilterBrand } from "./FilterBrand";
import { FilterYear } from "./FilterYear";
import { FilterPeriod } from "./FilterPeriod";
import { FilterMetric } from "./FilterMetric";
import { FilterSource } from "./FilterSource";

export function Filters() {
	const [open, setOpen] = useState(false);

	return (
		<div className="ml-auto">
			<div className="hidden w-full flex-1 items-end gap-4 lg:flex">
				<div className="w-56">
					<FilterDistr />
				</div>
				<div className="w-56">
					<FilterBrand />
				</div>
				<FilterYear />
				<FilterPeriod />
				<FilterMetric />
				<FilterSource />
			</div>

			<div className="lg:hidden">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<TriggerButton
							startIcon={Filter}
							className={cn(open ? "bg-secondary-bg-hover shadow-none" : "")}
						>
							Фильтры
							{open ? <Icon icon={ChevronUp} /> : <Icon icon={ChevronDown} />}
						</TriggerButton>
					</PopoverTrigger>
					<PopoverContent
						align="end"
						collisionPadding={16}
						className="max-h-[var(--radix-popover-content-available-height)] w-[24rem] overflow-y-auto"
					>
						<div className="flex w-full flex-col gap-4">
							<FilterDistr />
							<FilterBrand />
							<FilterYear />
							<FilterPeriod />
							<FilterMetric />
							<FilterSource />
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
