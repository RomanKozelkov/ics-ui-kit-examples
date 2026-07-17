import { IconButton } from "ics-ui-kit/components/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { PictureInPicture2 } from "lucide-react";

export const UndockAction = ({ onUndock }: { onUndock: () => void }) => {
	return (
		<TooltipProvider delayDuration={700}>
			<Tooltip>
				<TooltipTrigger asChild>
					<IconButton icon={PictureInPicture2} size="sm" variant="text" onClick={onUndock} />
				</TooltipTrigger>
				<TooltipContent side="bottom">Открепить в окно</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
