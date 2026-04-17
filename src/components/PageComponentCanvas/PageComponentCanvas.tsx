import { useEffect, useState } from "react";
import { ArrowLeft, PanelBottomClose, PanelBottomOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { UiComponent } from "../../data/types";
import * as UiComponents from "../../examples";
import { ComponentCode } from "../ComponentCode/ComponentCode";
import { ComponentHeader } from "../ComponentHeader/ComponentHeader";
import { cn } from "ics-ui-kit/lib/utils";
import { Button, IconButton } from "ics-ui-kit/components/button";
import { useTheme } from "../../lib/useTheme";

type PageComponentCanvasProps = UiComponent & {
	embed?: boolean;
	forcedTheme?: "light" | "dark";
};

export function PageComponentCanvas(props: PageComponentCanvasProps) {
	const [tab, setTab] = useState<"preview" | "code">("preview");
	const [panelOpen, setPanelOpen] = useState(true);
	const [theme, setTheme] = useTheme();
	const Component = UiComponents[props.component];
	const { embed, forcedTheme } = props;

	useEffect(() => {
		if (forcedTheme) setTheme(forcedTheme);
	}, [forcedTheme, setTheme]);

	if (embed) {
		return (
			<div
				className={cn(
					"h-screen w-screen overflow-auto",
					props.attributes.canvas?.classNames
				)}
			>
				<Component {...props.attributes.props} />
			</div>
		);
	}

	return (
		<div className="relative h-screen w-screen">
			{/* Full-screen preview */}

			<div className="h-screen w-screen">
				{tab === "preview" && (
					<div
						className={cn(
							"h-full w-full overflow-auto",
							props.attributes.canvas?.classNames
						)}
					>
						<Component {...props.attributes.props} />
					</div>
				)}

				{tab === "code" && (
					<div className="overflow-auto">
						<ComponentCode files={props.code} />
					</div>
				)}
			</div>

			{!panelOpen && (
				<div className="fixed bottom-0 left-0 py-2 px-2 z-[2147483647] opacity-30 hover:opacity-100 transition-opacity duration-200">
					<IconButton
						variant="outline"
						size="sm"
						onClick={() => setPanelOpen(true)}
						icon={PanelBottomOpen}
					/>
				</div>
			)}

			{/* Bottom panel */}
			{panelOpen && (
				<div className="py-2 px-2 fixed bottom-0 left-0 right-0 z-[2147483647] border-t border-secondary-border bg-primary-bg shadow-[0_-4px_16px_rgba(0,0,0,0.1)]">
					<div className="flex items-center">
						<div className="shrink-0">
							<IconButton
								variant="ghost"
								size="sm"
								onClick={() => setPanelOpen(false)}
								icon={PanelBottomClose}
							/>
						</div>
						<div className="shrink-0">
							<Link to="/">
								<Button
									variant="ghost"
									size="sm"
									asChild
									startIcon={ArrowLeft}
								>
									Back to home
								</Button>
							</Link>
						</div>
						<ComponentHeader
							title={props.attributes.title}
							slug={props.slug}
							component={props.component}
							activeTab={tab}
							onTabChange={setTab}
							theme={theme}
							onThemeChange={setTheme}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
