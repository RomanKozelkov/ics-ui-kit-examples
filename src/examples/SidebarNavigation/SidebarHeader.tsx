import { IconButton } from "ics-ui-kit/components/button";
import { Ellipsis, Grip, Search } from "lucide-react";
import { GramaxIcon } from "./GramaxIcon";

export function SidebarHeader() {
	return (
		<div className="group/header flex items-center gap-1 px-2 py-3 pr-4">
			<IconButton icon={Grip} size="sm" variant="ghost" className="shrink-0 p-2" iconClassName="size-4" />
			<div className="group/team flex min-w-0 flex-1 items-center gap-2 rounded-md p-0.5 pr-2 hover:cursor-pointer hover:bg-secondary-bg-hover">
				<GramaxIcon className="size-7 shrink-0" />
				<span className="flex-1 font-sans font-medium text-primary-fg">Gramax Team</span>
				<IconButton
					icon={Ellipsis}
					size="sm"
					variant="text"
					className="invisible size-4 p-0 group-hover/team:visible"
					iconClassName="size-4"
				/>
			</div>
			<IconButton icon={Search} size="sm" variant="ghost" className="shrink-0 p-2" iconClassName="size-4" />
		</div>
	);
}
