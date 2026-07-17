import { IconButton } from "ics-ui-kit/components/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { Ellipsis, Grip, PanelLeft } from "lucide-react";
import { GramaxIcon } from "./GramaxIcon";

interface SidebarHeaderProps {
	onCollapse: () => void;
}

export function SidebarHeader({ onCollapse }: SidebarHeaderProps) {
	return (
		<div className="flex h-[52px] items-center gap-1 p-2.5">
			<Tooltip>
				<TooltipTrigger asChild>
					<IconButton
						icon={Grip}
						size="sm"
						variant="ghost"
						className="shrink-0 rounded-md p-2"
						iconClassName="size-4"
					/>
				</TooltipTrigger>
				<TooltipContent focus="high">Главная</TooltipContent>
			</Tooltip>
			<div className="group/team flex min-w-0 flex-1 items-center gap-2 rounded-md p-0.5 pr-2 hover:cursor-pointer hover:bg-secondary-bg-hover">
				<GramaxIcon className="size-7 shrink-0" />
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="flex-1 font-sans font-medium text-primary-fg">Gramax Team</span>
					</TooltipTrigger>
					<TooltipContent focus="high">Gramax Team</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<IconButton
							icon={Ellipsis}
							size="sm"
							variant="text"
							className="invisible size-4 p-0 group-hover/team:visible"
							iconClassName="size-4"
						/>
					</TooltipTrigger>
					<TooltipContent focus="high">Действия с каталогом</TooltipContent>
				</Tooltip>
			</div>
			<Tooltip>
				<TooltipTrigger asChild>
					<IconButton
						icon={PanelLeft}
						size="sm"
						variant="ghost"
						className="shrink-0 rounded-md p-2"
						iconClassName="size-4"
						onClick={onCollapse}
					/>
				</TooltipTrigger>
				<TooltipContent focus="high">Свернуть панель</TooltipContent>
			</Tooltip>
		</div>
	);
}
