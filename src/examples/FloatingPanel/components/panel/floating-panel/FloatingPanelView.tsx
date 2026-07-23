import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "re-resizable";
import { cn } from "ics-ui-kit/lib/utils";
import { usePanelResize } from "../../../hooks/usePanelResize";
import {
	MAXIMIZED_PANEL_Z_INDEX,
	PANEL_MAX_HEIGHT,
	PANEL_MAX_WIDTH,
	PANEL_MIN_HEIGHT,
	PANEL_MIN_WIDTH
} from "../../../constants";
import { PanelBody } from "../common-components/PanelBody";
import { PanelId, Position, SideZoneSide } from "../../../types/FloatingPanelTypes";
import { PanelDragState } from "../../../hooks/usePanelDrag";
import { FloatingAction } from "./FloatingAction";
import { ResizableCornerIcon } from "ics-ui-kit/components/resizable";

type FloatingPanelViewProps = {
	id: PanelId;
	title: string;
	position: Position;
	zIndex: number;
	isMaximized: boolean;
	drag: PanelDragState;
	onDragStart: () => void;
	onClose: () => void;
	onDock: (side: SideZoneSide) => void;
	onMaximize: () => void;
	onRestore: () => void;
};

export const FloatingPanelView = ({
	id,
	title,
	position,
	zIndex,
	isMaximized,
	drag,
	onDragStart,
	onClose,
	onDock,
	onMaximize,
	onRestore
}: FloatingPanelViewProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = drag;
	const { size, livePosition, isResizing, resizableRef, handleResizeStart, handleResize, handleResizeStop } =
		usePanelResize(id, position, setNodeRef);

	if (!livePosition) return null;

	return (
		<Resizable
			ref={resizableRef}
			className={cn(
				"flex flex-col rounded-2xl bg-alpha-40 shadow-glass-md",
				(isDragging || isResizing) && "border border-muted",
				isMaximized && "rounded-none"
			)}
			style={
				isMaximized
					? { position: "fixed", inset: 0, zIndex: MAXIMIZED_PANEL_Z_INDEX }
					: {
							position: "absolute",
							left: livePosition.x,
							top: livePosition.y,
							zIndex,
							transform: CSS.Translate.toString(transform)
						}
			}
			size={isMaximized ? { width: "100%", height: "100%" } : undefined}
			defaultSize={size}
			minWidth={PANEL_MIN_WIDTH}
			maxWidth={isMaximized ? undefined : PANEL_MAX_WIDTH}
			minHeight={PANEL_MIN_HEIGHT}
			maxHeight={isMaximized ? undefined : PANEL_MAX_HEIGHT}
			enable={isMaximized ? false : undefined}
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
				bottomRight: <ResizableCornerIcon className="absolute bottom-[11px] right-[11px]" />
			}}
		>
			<div
				className={cn(
					"absolute inset-0 flex flex-col overflow-hidden",
					isMaximized ? "rounded-none" : "rounded-2xl"
				)}
				onMouseDown={isMaximized ? undefined : onDragStart}
			>
				<PanelBody
					title={title}
					onClose={onClose}
					drag={isMaximized ? undefined : { listeners, attributes, isDragging }}
					action={
						<FloatingAction
							onDock={onDock}
							isMaximized={isMaximized}
							onMaximize={onMaximize}
							onRestore={onRestore}
						/>
					}
				/>
			</div>
		</Resizable>
	);
};
