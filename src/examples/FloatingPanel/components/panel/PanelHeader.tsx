import { IconButton } from "ics-ui-kit/components/button";
import { Filter, Maximize2, X } from "lucide-react";
import { cn } from "ics-ui-kit/lib/utils";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

type PanelHeaderProps = {
	title: string;
	isDragging: boolean;
	listeners: DraggableSyntheticListeners;
	attributes: DraggableAttributes;
	onClose: () => void;
	className?: string;
};

export const PanelHeader = ({ title, isDragging, listeners, attributes, onClose, className }: PanelHeaderProps) => {
	return (
		<div
			{...listeners}
			{...attributes}
			className={cn(
				"absolute left-0 right-0 top-0 z-10 flex select-none items-center justify-between gap-4 p-2 pl-4 pt-2 focus-visible:outline-none",
				isDragging ? "cursor-grabbing" : "cursor-grab",
				className
			)}
			style={{
				maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
				background: "linear-gradient(to bottom, hsl(var(--secondary-bg) / 0.9) 0%, transparent 100%)"
			}}
		>
			<span className="flex flex-row items-center gap-2 text-base font-semibold">{title}</span>
			<div className="flex flex-row items-center" onPointerDown={(e) => e.stopPropagation()}>
				<IconButton icon={Filter} size="sm" variant="text" />
				<IconButton icon={Maximize2} size="sm" variant="text" />
				<IconButton icon={X} size="sm" variant="text" onClick={onClose} />
			</div>
		</div>
	);
};
