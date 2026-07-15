import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { IconButton } from "ics-ui-kit/components/button";
import { Container } from "ics-ui-kit/components/container";
import { Avatar, AvatarImage, AvatarFallback } from "ics-ui-kit/components/avatar";
import { Label } from "ics-ui-kit/components/label";
import { Description } from "ics-ui-kit/components/description";
import { Indicator } from "ics-ui-kit/components/indicator";
import { Text } from "ics-ui-kit/components/text";
import { Filter, Maximize2, X, type LucideIcon } from "lucide-react";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { useState } from "react";
import { cn } from "ics-ui-kit/lib/utils";
import { PANEL_MAX_HEIGHT, PANEL_WIDTH } from "../constants";
import { PanelId } from "../types/FloatingPanelTypes";

type FloatingPanelProps = {
	id: PanelId;
	title: string;
	icon: LucideIcon;
	onClose: () => void;
};

export const FloatingPanel = ({ id, title, icon: Icon, onClose }: FloatingPanelProps) => {
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
				"absolute flex flex-col overflow-hidden rounded-2xl border border-secondary-bg bg-alpha-20 shadow-2xl",
				isDragging && "border-muted"
			)}
			style={{
				left: position.x,
				top: position.y,
				width: PANEL_WIDTH,
				maxHeight: PANEL_MAX_HEIGHT,
				zIndex,
				transform: CSS.Translate.toString(transform)
			}}
			onMouseDown={() => bringToFront(id)}
		>
			<div
				ref={setNodeRef}
				className="flex flex-col overflow-y-auto"
				style={{ scrollbarWidth: "none" }}
				onScroll={handleScroll}
			>
				<div
					{...listeners}
					{...attributes}
					className={cn(
						"backdrop-glass-thick sticky top-0 z-10 flex select-none items-center justify-between gap-4 p-2 pl-4 pt-3 focus-visible:outline-none",
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

				<div className="flex flex-col px-1 pb-1">
					<Container type="round">
						<div className="flex flex-row gap-3">
							<Avatar size="sm">
								<AvatarImage src="https://github.com/shadcn.png" />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex w-full flex-col">
								<div className="relative flex flex-row items-baseline gap-2">
									<Label className="leading-5">Nikita Strapilov</Label>
									<Description size="xs">1 hour ago</Description>
									<Indicator className="absolute right-px top-px bg-status-error" rounded size="sm" />
								</div>
								<Text>Added event handler to dropdown component.</Text>
							</div>
						</div>
					</Container>

					<Container type="round">
						<div className="flex flex-row gap-3">
							<Avatar size="sm">
								<AvatarImage src="https://github.com/leerob.png" />
								<AvatarFallback>AK</AvatarFallback>
							</Avatar>
							<div className="flex w-full flex-col">
								<div className="relative flex flex-row items-baseline gap-2">
									<Label className="leading-5">Alexander Kurbatov</Label>
									<Description size="xs">yesterday</Description>
									<Indicator className="absolute right-px top-px bg-status-error" rounded size="sm" />
								</div>
								<Text>Added event handler to dropdown component.</Text>
							</div>
						</div>
					</Container>

					<Container type="round">
						<div className="flex flex-row gap-3">
							<Avatar size="sm">
								<AvatarFallback>SP</AvatarFallback>
							</Avatar>
							<div className="flex w-full flex-col">
								<div className="relative flex flex-row items-baseline gap-2">
									<Label className="leading-5">Stanislav Peremychkin</Label>
									<Description size="xs">1 day ago</Description>
									<Indicator className="absolute right-px top-px bg-status-error" rounded size="sm" />
								</div>
								<Text>Added event handler to dropdown component.</Text>
							</div>
						</div>
					</Container>

					<Container type="round">
						<div className="flex flex-row gap-3">
							<Avatar size="sm">
								<AvatarFallback>KB</AvatarFallback>
							</Avatar>
							<div className="flex w-full flex-col">
								<div className="relative flex flex-row items-baseline gap-2">
									<Label className="leading-5">Konstantin Borodinsky</Label>
									<Description size="xs">11 months ago</Description>
								</div>
								<Text>Added event handler to dropdown component.</Text>
							</div>
						</div>
					</Container>

					<Container type="round">
						<div className="flex flex-row gap-3">
							<Avatar size="sm">
								<AvatarFallback>BV</AvatarFallback>
							</Avatar>
							<div className="flex w-full flex-col">
								<div className="relative flex flex-row items-baseline gap-2">
									<Label className="leading-5">Borislav Vronsky</Label>
									<Description size="xs">1 year ago</Description>
								</div>
								<Text>Added event handler to dropdown component, updated 3 files.</Text>
							</div>
						</div>
					</Container>

					<Container type="round">
						<div className="flex flex-row gap-3">
							<Avatar size="sm">
								<AvatarFallback>NS</AvatarFallback>
							</Avatar>
							<div className="flex w-full flex-col">
								<div className="relative flex flex-row items-baseline gap-2">
									<Label className="leading-5">Nikolai Sorokin</Label>
									<Description size="xs">2 years ago</Description>
								</div>
								<Text>Refactored the sidebar navigation component.</Text>
							</div>
						</div>
					</Container>
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
