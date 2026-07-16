import { PanelContent } from "./PanelContent";
import { BottomShadow } from "./BottomShadow";
import { useAtBottomScroll } from "../../hooks/useAtBottomScroll";

export const PanelBody = () => {
	const { isAtBottom, handleScroll } = useAtBottomScroll();

	return (
		<>
			<div
				className="flex min-h-0 flex-1 flex-col overflow-y-auto"
				style={{ scrollbarWidth: "none" }}
				onScroll={handleScroll}
			>
				<PanelContent />
			</div>
			{!isAtBottom && <BottomShadow />}
		</>
	);
};
