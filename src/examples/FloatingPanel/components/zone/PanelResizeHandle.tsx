import { ResizableHandlePrimitive } from "ics-ui-kit/components/resizable";
import { cn } from "ics-ui-kit/lib/utils";
import { PANEL_GAP } from "../../constants";

export const PanelResizeHandle = () => {
	return (
		<ResizableHandlePrimitive
			className="group relative flex shrink-0 items-center justify-center"
			style={{ flexBasis: PANEL_GAP }}
		>
			<div
				className={cn(
					"rounded-full bg-transparent transition-colors group-hover:bg-primary-border group-data-[resize-handle-active]:bg-primary-border",
					"group-data-[panel-group-direction=horizontal]:h-8 group-data-[panel-group-direction=horizontal]:w-1",
					"group-data-[panel-group-direction=vertical]:h-1 group-data-[panel-group-direction=vertical]:w-8"
				)}
			/>
		</ResizableHandlePrimitive>
	);
};
