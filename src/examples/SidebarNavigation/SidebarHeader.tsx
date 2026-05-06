import { IconButton } from "ics-ui-kit/components/button";
import { Ellipsis, Grip, Search } from "lucide-react";
import { GramaxIcon } from "./GramaxIcon";

export function SidebarHeader() {
	return (
		<div className="group/header flex items-center gap-1 px-2 py-3">
			<IconButton icon={Grip} size="sm" variant="ghost" className="shrink-0 p-2" />
			<div className="flex min-w-0 flex-1 items-center gap-2 rounded-md p-0.5 pr-2 hover:cursor-pointer hover:bg-secondary-bg-hover">
				<GramaxIcon className="size-7 shrink-0" />
				<span className="flex-1 font-sans font-medium text-primary-fg">Gramax Team</span>
				<IconButton
					icon={Ellipsis}
					size="sm"
					variant="text"
					className="invisible size-3.5 p-0 group-hover/header:visible"
				/>
			</div>
			<IconButton icon={Search} size="sm" variant="ghost" className="shrink-0 p-2" />
		</div>
	);
}
