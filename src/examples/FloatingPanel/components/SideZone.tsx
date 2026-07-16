import { ResizablePanel } from "ics-ui-kit/components/resizable";

type SideZoneProps = {
	className?: string;
};

export const SideZone = ({ className }: SideZoneProps) => {
	return (
		<ResizablePanel defaultSize={15} minSize={12} maxSize={20}>
			<div className={className} />
		</ResizablePanel>
	);
};
