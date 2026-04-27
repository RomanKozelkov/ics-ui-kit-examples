import { IconButton } from "ics-ui-kit/components/button";
import { Grip, Search } from "lucide-react";
import { GramaxIcon } from "./GramaxIcon";

export function SidebarHeader() {
	return (
		<div className="flex items-center gap-2 px-2 py-2">
			<IconButton icon={Grip} size="sm" variant="ghost" className="p-2" />
			<GramaxIcon className="size-7 shrink-0" />
			<span className="flex-1 font-sans font-medium text-primary-fg">Gramax Team</span>
			<IconButton icon={Search} size="sm" variant="ghost" className="p-2" />
		</div>
	);
}
