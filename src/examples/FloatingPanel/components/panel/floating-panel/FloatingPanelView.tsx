import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "re-resizable";
import { cn } from "ics-ui-kit/lib/utils";
import { usePanelResize } from "../../../hooks/usePanelResize";
import { PANEL_MAX_HEIGHT, PANEL_MAX_WIDTH, PANEL_MIN_HEIGHT, PANEL_MIN_WIDTH } from "../../../constants";
import { ResizeHandle } from "./ResizeHandle";
import { PanelBody } from "../common-components/PanelBody";
import { PanelId, Position, SideZoneSide } from "../../../types/FloatingPanelTypes";
import { PanelDragState } from "../../../hooks/usePanelDrag";
import { FloatingAction } from "./FloatingAction";

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
				<PanelBody
					title={title}
					onClose={onClose}
					drag={{ listeners, attributes, isDragging }}
					action={<FloatingAction onDock={onDock} />}
				/>
			</div>
		</Resizable>
	);
};
