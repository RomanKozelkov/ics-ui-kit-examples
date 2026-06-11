import { cn } from "ics-ui-kit/lib/utils";
import React from "react";
import { InsertionDepthIcon } from "./InsertionDepthIcon";
import { InsertionTailLine } from "./InsertionTailLine";
import { iconLeft } from "../../../utils/sidebarInsertionLineUtils";
import { INSERTION_BUTTON_SIZE } from "../../../utils/constants";

type AfterContainerInsertionLineProps = {
	isVisible: boolean;
	onAdd: () => void;
};

export function AfterContainerInsertionLine({ isVisible, onAdd }: AfterContainerInsertionLineProps) {
	const [isActive, setIsActive] = React.useState(false);

	if (!isVisible) return null;

	const left = iconLeft(1, 0);
	const tailLeft = left + INSERTION_BUTTON_SIZE;

	return (
		<div data-sidebar="after-container-insertion-line" className="group/insertion relative z-10 mx-2 mt-3 h-2">
			<InsertionDepthIcon
				isHidden={false}
				isPlaceholder={false}
				isActive={isActive}
				style={{ left, cursor: "pointer" }}
				onClick={onAdd}
				onMouseEnter={() => setIsActive(true)}
				onMouseLeave={() => setIsActive(false)}
			/>
			<InsertionTailLine
				style={{ left: tailLeft }}
				className={cn(
					"!opacity-100",
					isActive
						? "bg-primary-fg"
						: "[background:linear-gradient(90deg,hsl(var(--muted))_0%,rgba(113,113,122,0.00)_100%)]"
				)}
			/>
		</div>
	);
}
