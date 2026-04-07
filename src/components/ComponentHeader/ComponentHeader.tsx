import { Tabs, TabsList, TabsTrigger } from "ics-ui-kit/components/tabs";

interface ComponentHeaderProps {
	title: string;
	activeTab: "preview" | "code";
	onTabChange: (tab: "preview" | "code") => void;
}

export function ComponentHeader({ title, activeTab, onTabChange }: ComponentHeaderProps) {
	return (
		<div className="flex items-center justify-between px-4 py-2 border border-b-0 border-secondary-border bg-background">
			<span className="text-sm font-medium text-foreground">{title}</span>
			<Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "preview" | "code")}>
				<TabsList>
					<TabsTrigger value="preview">Preview</TabsTrigger>
					<TabsTrigger value="code">Code</TabsTrigger>
				</TabsList>
			</Tabs>
		</div>
	);
}
