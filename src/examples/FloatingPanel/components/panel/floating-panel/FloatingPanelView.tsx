import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "re-resizable";
import { cn } from "ics-ui-kit/lib/utils";
import { usePanelResize } from "../../../hooks/usePanelResize";
import { PANEL_MAX_HEIGHT, PANEL_MAX_WIDTH, PANEL_MIN_HEIGHT, PANEL_MIN_WIDTH } from "../../../constants";
import { ResizeHandle } from "./ResizeHandle";
import { PanelHeader } from "../common-components/PanelHeader";
import { FloatingAction } from "./FloatingAction";
import { PanelContent } from "../common-components/PanelContent";
import { PanelId, Position, SideZoneSide } from "../../../types/FloatingPanelTypes";
import { PanelDragState } from "../../../hooks/usePanelDrag";

type FloatingPanelViewProps = {
	id: PanelId;
	title: string;
	position: Position;
	zIndex: number;
	drag: PanelDragState;
	onDragStart: () => void;
	onClose: () => void;
	onDock: (side: SideZoneSide) => void;
};

export const FloatingPanelView = ({
	id,
	title,
	position,
	zIndex,
	drag,
	onDragStart,
	onClose,
	onDock
}: FloatingPanelViewProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = drag;
	const { size, livePosition, isResizing, resizableRef, handleResizeStart, handleResize, handleResizeStop } =
		usePanelResize(id, position, setNodeRef);

	if (!livePosition) return null;

	return (
		<Resizable
			ref={resizableRef}
			className={cn(
				"shadow-glass-md flex flex-col overflow-hidden rounded-2xl border border-secondary-bg bg-alpha-40",
				(isDragging || isResizing) && "border-muted"
			)}
			style={{
				position: "absolute",
				left: livePosition.x,
				top: livePosition.y,
				zIndex,
				transform: CSS.Translate.toString(transform)
			}}
			defaultSize={size}
			minWidth={PANEL_MIN_WIDTH}
			maxWidth={PANEL_MAX_WIDTH}
			minHeight={PANEL_MIN_HEIGHT}
			maxHeight={PANEL_MAX_HEIGHT}
			onResizeStart={handleResizeStart}
			onResize={handleResize}
			onResizeStop={handleResizeStop}
			handleStyles={{
				top: { zIndex: 20 },
				topLeft: { zIndex: 20, cursor: "nwse-resize" },
				topRight: { zIndex: 20, cursor: "nesw-resize" },
				bottomRight: { zIndex: 20, cursor: "nwse-resize" },
				bottomLeft: { cursor: "nesw-resize" }
			}}
			handleComponent={{
				bottomRight: <ResizeHandle />
			}}
		>
			<div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl" onMouseDown={onDragStart}>
				<div className="backdrop-glass-regular pointer-events-none absolute inset-0 -z-10" />
				<PanelHeader
					title={title}
					onClose={onClose}
					listeners={listeners}
					attributes={attributes}
					isDragging={isDragging}
					action={<FloatingAction onDock={onDock} />}
				/>
				<PanelContent />
			</div>
		</Resizable>
	);
};
