import { useState } from "react";
import { ArrowLeft, PanelBottomClose, PanelBottomOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { UiComponent } from "../../data/types";
import * as UiComponents from "../../examples";
import { ComponentCode } from "../ComponentCode/ComponentCode";
import { ComponentHeader } from "../ComponentHeader/ComponentHeader";
import { cn } from "ics-ui-kit/lib/utils";
import { Button, IconButton } from "ics-ui-kit/components/button";

export function PageComponentCanvas(props: UiComponent) {
	const [tab, setTab] = useState<"preview" | "code">("preview");
	const [panelOpen, setPanelOpen] = useState(true);
	const Component = UiComponents[props.component];

	return (
		<div className="relative h-screen w-screen">
			{/* Full-screen preview */}

			{tab === "preview" && (
				<div
					className={cn(
						"h-full w-full overflow-auto",
						props.attributes.canvas.classNames
					)}
				>
					<Component {...props.attributes.props} />
				</div>
			)}

			{tab === "code" && (
				<div className="max-h-[40vh] overflow-auto">
					<ComponentCode files={props.code} />
				</div>
			)}

			{!panelOpen && (
				<div className="fixed bottom-0 left-0 py-2 px-2">
					<IconButton
						variant="ghost"
						size="sm"
						onClick={() => setPanelOpen(true)}
						icon={PanelBottomOpen}
					/>
				</div>
			)}

			{/* Bottom panel */}
			{panelOpen && (
				<div className="py-2 px-2 fixed bottom-0 left-0 right-0 z-50 border-t border-secondary-border bg-background shadow-[0_-4px_16px_rgba(0,0,0,0.1)]">
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
						/>
					</div>
				</div>
			)}
		</div>
	);
}
