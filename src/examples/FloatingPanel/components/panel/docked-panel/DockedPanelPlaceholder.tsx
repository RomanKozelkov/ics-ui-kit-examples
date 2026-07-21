import { UndockAction } from "../actions/UndockAction";
import { PanelContent } from "../PanelContent";
import { PanelHeader } from "../PanelHeader";

type DockedPanelPlaceholderProps = {
	title: string;
	onClose: () => void;
	onUndock: () => void;
};

export const DockedPanelPlaceholder = ({ title, onClose, onUndock }: DockedPanelPlaceholderProps) => {
	return (
		<div className="shadow-glass-lg relative h-full w-full overflow-hidden rounded-2xl border border-secondary-border bg-secondary-bg opacity-50">
			<div className="backdrop-glass-regular pointer-events-none absolute inset-0 -z-10" />
			<PanelHeader
				title={title}
				onClose={onClose}
				listeners={undefined}
				attributes={undefined}
				isDragging={false}
				action={<UndockAction onUndock={onUndock} />}
			/>
			<PanelContent />
		</div>
	);
};
