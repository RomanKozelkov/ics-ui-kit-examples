import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useFloatingPanelStore } from "../../store/useFloatingPanelStore";
import { Resizable } from "re-resizable";
import { cn } from "ics-ui-kit/lib/utils";
import { PANEL_MAX_HEIGHT, PANEL_MAX_WIDTH, PANEL_MIN_HEIGHT, PANEL_MIN_WIDTH } from "../../constants";
import { PanelId } from "../../types/FloatingPanelTypes";
import { usePanelResize } from "../../hooks/usePanelResize";
import { PanelHeader } from "./PanelHeader";
import { PanelBody } from "./PanelBody";
import { ResizeHandle } from "./ResizeHandle";

type PanelProps = {
	id: PanelId;
	title: string;
	onClose: () => void;
};

export const Panel = ({ id, title, onClose }: PanelProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
	const position = useFloatingPanelStore((state) => state.panels[id].position);
	const zIndex = useFloatingPanelStore((state) => state.panels[id].zIndex);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);
	const { size, livePosition, isResizing, resizableRef, handleResizeStart, handleResize, handleResizeStop } =
		usePanelResize(id, position, setNodeRef);

	if (!position || !livePosition) return null;

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
			<div
				className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl"
				onMouseDown={() => bringToFront(id)}
			>
				<div className="backdrop-glass-regular pointer-events-none absolute inset-0 -z-10" />
				<PanelHeader
					title={title}
					isDragging={isDragging}
					listeners={listeners}
					attributes={attributes}
					onClose={onClose}
					className="backdrop-glass-regular"
				/>
				<PanelBody />
			</div>
		</Resizable>
	);
};
