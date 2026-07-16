import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { IconButton } from "ics-ui-kit/components/button";
import { Filter, Maximize2, X, type LucideIcon } from "lucide-react";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { Resizable } from "re-resizable";
import { cn } from "ics-ui-kit/lib/utils";
import { PANEL_MAX_HEIGHT, PANEL_MAX_WIDTH, PANEL_MIN_HEIGHT, PANEL_MIN_WIDTH } from "../constants";
import { PanelId } from "../types/FloatingPanelTypes";
import { PanelContent } from "./PanelContent";
import { usePanelResize } from "../hooks/usePanelResize";
import { useAtBottomScroll } from "../hooks/useAtBottomScroll";
import { BottomShadow } from "./BottomShadow";
import { ResizeHandle } from "./ResizeHandle";

type PanelProps = {
	id: PanelId;
	title: string;
	onClose: () => void;
};

export const Panel = ({ id, title, onClose }: PanelProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
	const { isAtBottom, handleScroll } = useAtBottomScroll();
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
				"flex flex-col overflow-hidden rounded-2xl border border-secondary-bg bg-alpha-80",
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
					"0 2px 1px 0 #FFF inset, 0 -6px 3px 0 #FFF inset, 0 50px 200px -20px rgba(161, 161, 170, 0.12) inset, 1.25px 0 0 -0.75px var(--tailwind-colors-zinc-400, #A1A1AA), -1.25px 0 0 -0.75px var(--tailwind-colors-zinc-400, #A1A1AA), 0 0 0 0.5px var(--base-secondary-border, #E4E4E7), 0 4px 24px 0 rgba(0, 0, 0, 0.12)"
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
				<div className="backdrop-glass-thick pointer-events-none absolute inset-0 -z-10" />
				<div
					{...listeners}
					{...attributes}
					className={cn(
						"backdrop-glass-thick absolute left-0 right-0 top-0 z-10 flex select-none items-center justify-between gap-4 p-2 pl-4 pt-2 focus-visible:outline-none",
						isDragging ? "cursor-grabbing" : "cursor-grab"
					)}
					style={{
						maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
						background: "linear-gradient(to bottom, hsl(var(--secondary-bg) / 0.9) 0%, transparent 100%)"
					}}
				>
					<span className="flex flex-row items-center gap-2 text-base font-semibold">{title}</span>
					<div className="flex flex-row items-center">
						<IconButton icon={Filter} size="sm" variant="text" />
						<IconButton icon={Maximize2} size="sm" variant="text" />
						<IconButton icon={X} size="sm" variant="text" onClick={onClose} />
					</div>
				</div>
				<div
					className="flex min-h-0 flex-1 flex-col overflow-y-auto"
					style={{ scrollbarWidth: "none" }}
					onScroll={handleScroll}
				>
					<PanelContent />
				</div>
				{!isAtBottom && <BottomShadow />}
			</div>
		</Resizable>
	);
};
