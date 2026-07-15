import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { IconButton } from "ics-ui-kit/components/button";
import { Filter, Maximize2, X, type LucideIcon } from "lucide-react";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { useState } from "react";
import { cn } from "ics-ui-kit/lib/utils";
import { PANEL_MAX_HEIGHT, PANEL_WIDTH } from "../constants";
import { PanelId } from "../types/FloatingPanelTypes";
import { ActivityItem } from "./ActivityItem";

type PanelProps = {
	id: PanelId;
	title: string;
	icon: LucideIcon;
	onClose: () => void;
};

export const Panel = ({ id, title, icon: Icon, onClose }: PanelProps) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
	const position = useFloatingPanelStore((state) => state.panels[id].position);
	const zIndex = useFloatingPanelStore((state) => state.panels[id].zIndex);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);
	const [isAtBottom, setIsAtBottom] = useState(false);

	if (!position) return null;

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
	};

	return (
		<div
			className={cn(
				"absolute flex flex-col overflow-hidden rounded-2xl border border-secondary-bg bg-alpha-80",
				isDragging && "border-muted"
			)}
			style={{
				left: position.x,
				top: position.y,
				width: PANEL_WIDTH,
				maxHeight: PANEL_MAX_HEIGHT,
				zIndex,
				transform: CSS.Translate.toString(transform),
				// TODO: Убрать тень, поменять на переменную из ui kit
				boxShadow:
					"0 2px 1px 0 #FFF inset, 0 -6px 3px 0 #FFF inset, 0 50px 200px -20px rgba(161, 161, 170, 0.12) inset, 1.25px 0 0 -0.75px var(--tailwind-colors-zinc-400, #A1A1AA), -1.25px 0 0 -0.75px var(--tailwind-colors-zinc-400, #A1A1AA), 0 0 0 0.5px var(--base-secondary-border, #E4E4E7), 0 4px 24px 0 rgba(0, 0, 0, 0.12)"
			}}
			onMouseDown={() => bringToFront(id)}
		>
			<div className="backdrop-glass-thick pointer-events-none absolute inset-0 -z-10" />
			<div
				{...listeners}
				{...attributes}
				className={cn(
					"backdrop-glass-thick absolute left-0 right-0 top-0 z-10 flex select-none items-center justify-between gap-4 p-2 pl-4 pt-3 focus-visible:outline-none",
					isDragging ? "cursor-grabbing" : "cursor-grab"
				)}
				style={{
					maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
					background: "linear-gradient(to bottom, hsl(var(--secondary-bg) / 0.9) 0%, transparent 100%)"
				}}
			>
				<span className="flex flex-row items-center gap-2 text-base font-semibold">
					<Icon className="h-4 w-4" />
					{title}
				</span>
				<div className="flex flex-row items-center">
					<IconButton icon={Filter} size="sm" variant="text" />
					<IconButton icon={Maximize2} size="sm" variant="text" />
					<IconButton icon={X} size="sm" variant="text" onClick={onClose} />
				</div>
			</div>

			<div
				ref={setNodeRef}
				className="flex min-h-0 flex-1 flex-col overflow-y-auto"
				style={{ scrollbarWidth: "none" }}
				onScroll={handleScroll}
			>
				<div className="flex flex-col px-1 pb-1 pt-14">
					<ActivityItem
						avatarSrc="https://github.com/shadcn.png"
						avatarFallback="CN"
						author="Nikita Strapilov"
						time="1 hour ago"
						description="Added event handler to dropdown component."
						showIndicator
					/>

					<ActivityItem
						avatarSrc="https://github.com/leerob.png"
						avatarFallback="AK"
						author="Alexander Kurbatov"
						time="yesterday"
						description="Added event handler to dropdown component."
						showIndicator
					/>

					<ActivityItem
						avatarFallback="SP"
						author="Stanislav Peremychkin"
						time="1 day ago"
						description="Added event handler to dropdown component."
						showIndicator
					/>

					<ActivityItem
						avatarFallback="KB"
						author="Konstantin Borodinsky"
						time="11 months ago"
						description="Added event handler to dropdown component."
					/>

					<ActivityItem
						avatarFallback="BV"
						author="Borislav Vronsky"
						time="1 year ago"
						description="Added event handler to dropdown component, updated 3 files."
					/>

					<ActivityItem
						avatarFallback="NS"
						author="Nikolai Sorokin"
						time="2 years ago"
						description="Refactored the sidebar navigation component."
					/>
				</div>
			</div>

			{!isAtBottom && (
				<div
					className="pointer-events-none absolute bottom-0 left-0 right-0"
					style={{
						height: 32,
						background: "linear-gradient(to bottom, transparent 0%, hsl(var(--secondary-bg) / 0.8) 100%)",
						zIndex: 10
					}}
				/>
			)}
		</div>
	);
};
