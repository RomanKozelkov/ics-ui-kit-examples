import { GitBranch, History, RefreshCw } from "lucide-react";

export function SidebarFooter() {
	return (
		<div className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-white text-xs">
			<GitBranch className="size-3.5" />
			<span className="flex-1 font-medium">master</span>
			<History className="size-3.5 opacity-80" />
			<RefreshCw className="size-3.5 opacity-80" />
			<span className="opacity-80">1↑</span>
		</div>
	);
}
