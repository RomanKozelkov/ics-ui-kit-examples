import { useState, type ReactNode } from "react";
import { TriggerButton } from "ics-ui-kit/components/button";
import { Icon } from "ics-ui-kit/components/icon";
import { Popover, PopoverContent, PopoverTrigger } from "ics-ui-kit/components/popover";
import { cn } from "ics-ui-kit/lib/utils";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

/** Один фильтр в баре. `width` (Tailwind-класс) задаёт ширину поля в десктоп-ряду; без него — натуральная. */
export type FilterEntry = {
	node: ReactNode;
	width?: string;
};

type FiltersBarProps = {
	filters: FilterEntry[];
};

/**
 * Каркас панели фильтров дашборда: десктоп-ряд + мобильный popover.
 * Набор фильтров приходит пропсом — список один, рендерится в обоих раскладках.
 */
export function FiltersBar({ filters }: FiltersBarProps) {
	const [open, setOpen] = useState(false);

	return (
		<div className="ml-auto">
			<div className="hidden w-full flex-1 items-end gap-4 lg:flex">
				{filters.map(({ node, width }, i) =>
					width ? (
						<div key={i} className={width}>
							{node}
						</div>
					) : (
						<div key={i} className="contents">
							{node}
						</div>
					)
				)}
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
							{filters.map(({ node }, i) => (
								<div key={i} className="contents">
									{node}
								</div>
							))}
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
