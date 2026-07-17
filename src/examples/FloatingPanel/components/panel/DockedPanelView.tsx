import { CSS } from "@dnd-kit/utilities";
import { cn } from "ics-ui-kit/lib/utils";
import { PanelContent } from "./PanelContent";
import { PanelHeader } from "./PanelHeader";
import { PanelDragState } from "../../hooks/usePanelDrag";
import { PANEL_DEFAULT_HEIGHT } from "../../constants";
import { UndockAction } from "./actions/UndockAction";

type DockedPanelViewProps = {
	title: string;
	zIndex: number;
	drag: PanelDragState;
	onDragStart: () => void;
	onClose: () => void;
	onUndock: () => void;
};

export const DockedPanelView = ({ title, zIndex, drag, onDragStart, onClose, onUndock }: DockedPanelViewProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging, dockedDragRect } = drag;
	const isFloatingWhileDragging = isDragging && dockedDragRect;

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"shadow-glass-md flex flex-col overflow-hidden rounded-2xl border border-secondary-border bg-secondary-bg",
				isFloatingWhileDragging ? "w-80 bg-alpha-40" : "relative h-full w-full",
				isDragging && "border-muted"
			)}
			style={
				isFloatingWhileDragging
					? {
							position: "fixed",
							left: dockedDragRect.left,
							top: dockedDragRect.top,
							height: PANEL_DEFAULT_HEIGHT,
							zIndex,
							transform: CSS.Translate.toString(transform)
						}
					: undefined
			}
			onMouseDown={onDragStart}
		>
			<div className="backdrop-glass-regular pointer-events-none absolute inset-0 -z-10" />
			<PanelHeader
				title={title}
				onClose={onClose}
				listeners={listeners}
				attributes={attributes}
				isDragging={isDragging}
				action={<UndockAction onUndock={onUndock} />}
			/>
			<PanelContent />
		</div>
	);
};
