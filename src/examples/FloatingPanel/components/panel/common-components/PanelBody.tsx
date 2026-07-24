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
			<div className="h-11 shrink-0" />
			<PanelContent />
			<PanelHeader title={title} onClose={onClose} drag={drag} action={action} />
		</>
	);
};
