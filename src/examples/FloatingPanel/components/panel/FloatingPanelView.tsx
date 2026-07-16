import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "re-resizable";
import { cn } from "ics-ui-kit/lib/utils";
import { PanelContent } from "./PanelContent";
import { PanelHeader } from "./PanelHeader";
import { ResizeHandle } from "./ResizeHandle";
import { PanelDragState } from "../../hooks/usePanelDrag";
import { usePanelResize } from "../../hooks/usePanelResize";
import { PanelId, Position } from "../../types/FloatingPanelTypes";
import { PANEL_MAX_HEIGHT, PANEL_MAX_WIDTH, PANEL_MIN_HEIGHT, PANEL_MIN_WIDTH } from "../../constants";

type FloatingPanelViewProps = {
	id: PanelId;
	title: string;
	position: Position;
	zIndex: number;
	drag: PanelDragState;
	onDragStart: () => void;
	onClose: () => void;
};

export const FloatingPanelView = ({
	id,
	title,
	position,
	zIndex,
	drag,
	onDragStart,
	onClose
}: FloatingPanelViewProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = drag;
	const { size, livePosition, isResizing, resizableRef, handleResizeStart, handleResize, handleResizeStop } =
		usePanelResize(id, position, setNodeRef);

	if (!livePosition) return null;

	return (
		<Resizable
			ref={resizableRef}
			className={cn(
				"flex flex-col overflow-hidden rounded-2xl border border-secondary-bg bg-alpha-40",
				(isDragging || isResizing) && "border-muted"
			)}
			style={{
				position: "absolute",
				left: livePosition.x,
				top: livePosition.y,
				zIndex,
				transform: CSS.Translate.toString(transform),
				// TODO: Убрать тень, поменять на переменную из ui kit
				boxShadow:
					"0 1.5px 1.5px -0.5px rgb(255, 255, 255) inset, 0 -6px 3px -3px rgb(255, 255, 255) inset, 1.25px 0 0 -0.75px var(--tailwind-colors-zinc-400, #A1A1AA), -1.25px 0 0 -0.75px var(--tailwind-colors-zinc-400, #A1A1AA), 0 0 0 0.5px var(--base-primary-border, #D4D4D8), 0 4px 24px 0 rgba(0, 0, 0, 0.12)"
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
				/>
				<PanelContent />
			</div>
		</Resizable>
	);
};
