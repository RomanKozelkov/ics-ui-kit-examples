import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { IconButton } from "ics-ui-kit/components/button";
import { cn } from "ics-ui-kit/lib/utils";
import { Filter, X } from "lucide-react";
import { SideZoneSide } from "../../types/FloatingPanelTypes";
import { UndockAction } from "./actions/UndockAction";
import { DockAction } from "./actions/DockAction";

type PanelHeaderProps = {
	title: string;
	onClose: () => void;
	listeners: SyntheticListenerMap | undefined;
	attributes: DraggableAttributes | undefined;
	isDragging: boolean;
	action: React.ReactNode;
};

export const PanelHeader = ({ title, onClose, listeners, attributes, isDragging, action }: PanelHeaderProps) => {
	return (
		<div
			{...listeners}
			{...attributes}
			className={cn(
				"backdrop-glass-regular absolute left-0 right-0 top-0 z-10 flex select-none items-center justify-between gap-4 p-2 pl-4 pt-2 focus-visible:outline-none",
				isDragging ? "cursor-grabbing" : "cursor-grab"
			)}
			style={{
				maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
				background: "linear-gradient(to bottom, hsl(var(--secondary-bg) / 0.9) 0%, transparent 100%)",
				touchAction: "none"
			}}
		>
			<span className="flex flex-row items-center gap-2 text-base font-semibold">{title}</span>
			<div className="flex flex-row items-center" onPointerDown={(e) => e.stopPropagation()}>
				<IconButton icon={Filter} size="sm" variant="text" />
				{action}
				<IconButton icon={X} size="sm" variant="text" onClick={onClose} />
			</div>
		</div>
	);
};
