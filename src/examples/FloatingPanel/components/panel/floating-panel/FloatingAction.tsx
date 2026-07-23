import { IconButton } from "ics-ui-kit/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "ics-ui-kit/components/dropdown";
import { Maximize2, PanelLeft, PanelRight, PictureInPicture, PictureInPicture2 } from "lucide-react";
import { SideZoneSide } from "../../../types/FloatingPanelTypes";
import { Icon } from "ics-ui-kit/components/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ics-ui-kit/components/tooltip";

type FloatingActionProps = {
	onDock: (side: SideZoneSide) => void;
	isMaximized: boolean;
	onMaximize: () => void;
	onRestore: () => void;
};

export const FloatingAction = ({ onDock, isMaximized, onMaximize, onRestore }: FloatingActionProps) => {
	if (isMaximized)
		return (
			<TooltipProvider delayDuration={700}>
				<Tooltip>
					<TooltipTrigger asChild>
						<IconButton icon={PictureInPicture} size="sm" variant="text" onClick={onRestore} />
					</TooltipTrigger>
					<TooltipContent side="bottom" className="z-[9999]">
						Свернуть
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<IconButton icon={Maximize2} size="sm" variant="text" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="z-[9999]">
				<DropdownMenuItem onSelect={() => onDock("left")}>
					<Icon icon={PanelLeft} />
					Поместить в панель слева
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => onDock("right")}>
					<Icon icon={PanelRight} />
					Поместить в панель справа
				</DropdownMenuItem>

				<DropdownMenuItem onSelect={onMaximize}>
					<Icon icon={PictureInPicture2} />
					Развернуть на весь экран
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
