import { CSS } from "@dnd-kit/utilities";
import { cn } from "ics-ui-kit/lib/utils";
import { PanelBody } from "../common-components/PanelBody";
import { PanelDragState } from "../../../hooks/usePanelDrag";
import { useFloatingPanelStore } from "../../../store/useFloatingPanelStore";
import { DockedAction } from "./DockedAction";

type DockedPanelViewProps = {
	title: string;
	zIndex: number;
	drag: PanelDragState;
	onDragStart: () => void;
	onClose: () => void;
	onUndock: () => void;
};

export const DockedPanelView = ({ title, zIndex, drag, onDragStart, onClose, onUndock }: DockedPanelViewProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging, dockedDragRect } = drag;
	const isResizingDockedPanels = useFloatingPanelStore((state) => state.isResizingDockedPanels);
	const isFloatingWhileDragging = isDragging && dockedDragRect;

	return (
		<>
			<div
				ref={setNodeRef}
				className={cn(
					"shadow-glass-lg flex flex-col overflow-hidden rounded-2xl bg-alpha-40",
					isFloatingWhileDragging ? "bg-alpha-40" : "relative h-full w-full",
					(isDragging || isResizingDockedPanels) && "border border-muted"
				)}
				style={
					isFloatingWhileDragging
						? {
								position: "fixed",
								left: dockedDragRect.left,
								top: dockedDragRect.top,
								width: dockedDragRect.width,
								height: dockedDragRect.height,
								zIndex,
								transform: CSS.Translate.toString(transform)
							}
						: {
								transform: CSS.Transform.toString(transform),
								transition
							}
				}
				onMouseDown={onDragStart}
			>
				<PanelBody
					title={title}
					onClose={onClose}
					drag={{ listeners, attributes, isDragging }}
					action={<DockedAction onUndock={onUndock} />}
				/>
			</div>
		</>
	);
};
