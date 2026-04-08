import { IconButton } from "ics-ui-kit/components/button";
import { Divider } from "ics-ui-kit/components/divider";
import { Tabs, TabsList, TabsTrigger } from "ics-ui-kit/components/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "ics-ui-kit/components/tooltip";
import { ExternalLink, Pencil } from "lucide-react";
import { GITHUB_REPO_URL } from "../../data/config";
import { GithubIcon } from "../icons/GithubIcon";

interface ComponentHeaderProps {
	title: string;
	slug: string;
	component: string;
	activeTab: "preview" | "code";
	onTabChange: (tab: "preview" | "code") => void;
}

export function ComponentHeader({
	title,
	slug,
	component,
	activeTab,
	onTabChange
}: ComponentHeaderProps) {
	return (
		<div className="flex items-center py-2 bg-background h-8 gap-4 w-full">
			<Tabs
				value={activeTab}
				onValueChange={(v) => onTabChange(v as "preview" | "code")}
			>
				<TabsList className="text-xs p-1 h-8 lg:h-8">
					<TabsTrigger
						value="preview"
						className="text-xs py-1 px-2 h-6"
					>
						Preview
					</TabsTrigger>
					<TabsTrigger value="code" className="text-xs py-1 px-2 h-6">
						Code
					</TabsTrigger>
				</TabsList>
			</Tabs>
			<Divider orientation="vertical" className="m-2" />
			<a
				href={`#${slug}`}
				className="text-sm text-foreground hover:underline font-semibold flex-auto"
			>
				{title}
			</a>
			<div className="ml-auto flex items-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<a
							href={`/component/${slug}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<IconButton
								icon={ExternalLink}
								size="sm"
								variant="outline"
							/>
						</a>
					</TooltipTrigger>
					<TooltipContent>View component in isolation</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<a
							href={`${GITHUB_REPO_URL}/tree/master/src/examples/${component}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<IconButton
								icon={GithubIcon}
								size="sm"
								variant="outline"
							/>
						</a>
					</TooltipTrigger>
					<TooltipContent>View source on GitHub</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<IconButton icon={Pencil} size="sm" variant="outline" />
					</TooltipTrigger>
					<TooltipContent>Open in CodeSandbox</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
