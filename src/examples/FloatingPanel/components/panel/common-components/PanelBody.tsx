import { PanelHeader, PanelHeaderDragProps } from "./PanelHeader";
import { PanelContent } from "./PanelContent";

type PanelBodyProps = {
	title: string;
	onClose: () => void;
	drag?: PanelHeaderDragProps;
	action: React.ReactNode;
};

export const PanelBody = ({ title, onClose, drag, action }: PanelBodyProps) => {
	return (
		<>
			<div className="backdrop-glass-regular pointer-events-none absolute inset-0 -z-10" />
			<PanelHeader title={title} onClose={onClose} drag={drag} action={action} />
			<PanelContent />
		</>
	);
};
