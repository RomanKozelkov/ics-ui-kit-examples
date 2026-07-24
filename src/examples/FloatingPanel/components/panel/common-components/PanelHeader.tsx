import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { IconButton } from "ics-ui-kit/components/button";
import { cn } from "ics-ui-kit/lib/utils";
import { Filter, X } from "lucide-react";
import { useState } from "react";

export type PanelHeaderDragProps = {
	listeners: SyntheticListenerMap | undefined;
	attributes: DraggableAttributes;
	isDragging: boolean;
};

type PanelHeaderProps = {
	title: string;
	onClose: () => void;
	drag?: PanelHeaderDragProps;
	action: React.ReactNode;
};

export const PanelHeader = ({ title, onClose, drag, action }: PanelHeaderProps) => {
	const [isPressed, setIsPressed] = useState(false);

	return (
		<div
			{...drag?.listeners}
			{...drag?.attributes}
			onPointerDown={(e) => {
				setIsPressed(true);
				drag?.listeners?.onPointerDown?.(e);
			}}
			onPointerUp={() => setIsPressed(false)}
			onPointerCancel={() => setIsPressed(false)}
			onLostPointerCapture={() => setIsPressed(false)}
			className={cn(
				"absolute left-0 right-0 top-0 z-10 flex select-none items-center justify-between gap-4 p-2 pl-4 pt-2 focus-visible:outline-none",
				drag?.isDragging || isPressed ? "cursor-grabbing" : "cursor-grab"
			)}
			style={{
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
