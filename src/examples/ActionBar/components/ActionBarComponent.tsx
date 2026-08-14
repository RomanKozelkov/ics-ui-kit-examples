import { EllipsisVertical, LucideIcon } from "lucide-react";
import { IconButton } from "ics-ui-kit/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "ics-ui-kit/components/dropdown";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { useActionBarOverflow } from "../hooks/useActionBarOverflow";

export type ActionBarItem = {
	id: string;
	label: string;
	icon: LucideIcon;
};

export type ActionBarProps = {
	title?: React.ReactNode;
	items: ActionBarItem[];
};

/**
 * Атомарная полоса «заголовок + действия»: не знает про грид/форму/счётчики.
 * Заголовок — non-collapsible слот, всегда обрезается truncate+tooltip.
 * Кнопки, которые не поместились, уходят в overflow-меню по порядку с конца.
 */
export function ActionBarComponent({ title, items }: ActionBarProps) {
	const { visibleCount, containerRef } = useActionBarOverflow(items.length, Boolean(title));

	const visibleItems = items.slice(0, visibleCount);
	const overflowItems = items.slice(visibleCount);

	return (
		<div ref={containerRef} className="flex min-w-0 items-center gap-1">
			{title && (
				<div className="min-w-0 flex-1">
					<TextOverflowTooltip>{title}</TextOverflowTooltip>
				</div>
			)}

			<div className="flex shrink-0 items-center gap-1">
				{visibleItems.map((item) => (
					<span key={item.id}>
						<IconButton
							icon={item.icon}
							size="sm"
							variant="ghost"
							aria-label={item.label}
							onClick={() => console.log(item.label)}
						/>
					</span>
				))}

				{overflowItems.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<span>
								<IconButton
									icon={EllipsisVertical}
									size="sm"
									variant="ghost"
									aria-label="Ещё действия"
								/>
							</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{overflowItems.map((item) => (
								<DropdownMenuItem key={item.id} onSelect={() => console.log(item.label)}>
									{item.label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</div>
	);
}
