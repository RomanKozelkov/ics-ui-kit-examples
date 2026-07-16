import { useDraggable } from "@dnd-kit/core";
import { PanelId } from "../../types/FloatingPanelTypes";
import { PanelHeader } from "../panel/PanelHeader";
import { PanelBody } from "../panel/PanelBody";

type DockedPanelProps = {
	id: PanelId;
	title: string;
	onClose: () => void;
};

export const DockedPanel = ({ id, title, onClose }: DockedPanelProps) => {
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

	return (
		<div ref={setNodeRef} className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl">
			<PanelHeader
				title={title}
				isDragging={isDragging}
				listeners={listeners}
				attributes={attributes}
				onClose={onClose}
			/>
			<PanelBody />
		</div>
	);
};
