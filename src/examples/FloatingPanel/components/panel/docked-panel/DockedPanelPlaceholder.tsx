import { DockedAction } from "./DockedAction";
import { PanelBody } from "../common-components/PanelBody";

type DockedPanelPlaceholderProps = {
	title: string;
	onClose: () => void;
	onUndock: () => void;
};

export const DockedPanelPlaceholder = ({ title, onClose, onUndock }: DockedPanelPlaceholderProps) => {
	return (
		<div className="shadow-glass-lg relative h-full w-full overflow-hidden rounded-2xl border border-secondary-border bg-secondary-bg opacity-50">
			<PanelBody title={title} onClose={onClose} action={<DockedAction onUndock={onUndock} />} />
		</div>
	);
};
