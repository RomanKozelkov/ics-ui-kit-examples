import { IconButton } from "ics-ui-kit/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "ics-ui-kit/components/dropdown";
import { Maximize2, PanelLeft, PanelRight } from "lucide-react";
import { SideZoneSide } from "../../../types/FloatingPanelTypes";
import { Icon } from "ics-ui-kit/components/icon";

export const FloatingAction = ({ onDock }: { onDock: (side: SideZoneSide) => void }) => {
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
