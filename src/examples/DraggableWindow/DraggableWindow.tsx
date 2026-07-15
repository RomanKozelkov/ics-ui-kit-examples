import { DndContext, useDraggable, type DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { IconButton } from "ics-ui-kit/components/button";
import { Container } from "ics-ui-kit/components/container";
import { Avatar, AvatarImage, AvatarFallback } from "ics-ui-kit/components/avatar";
import { Label } from "ics-ui-kit/components/label";
import { Description } from "ics-ui-kit/components/description";
import { Indicator } from "ics-ui-kit/components/indicator";
import { Text } from "ics-ui-kit/components/text";
import { Filter, GitCompare, History, Maximize2, X } from "lucide-react";
import { useRef, useState } from "react";
import { useWindowPositionStore } from "./store/useWindowPositionStore";

const WINDOW_ID = "draggable-window";
const WINDOW_WIDTH = 320;
const WINDOW_MAX_HEIGHT = 480;
const WINDOW_GAP = 12;

const Window = ({ onClose }: { onClose: () => void }) => {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: WINDOW_ID });
	const position = useWindowPositionStore((state) => state.position);
	const [isAtBottom, setIsAtBottom] = useState(false);

	if (!position) return null;

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
	};

	return (
		<div
			ref={setNodeRef}
			className="absolute flex w-80 flex-col rounded-2xl border border-secondary-bg shadow-2xl"
			style={{
				left: position.x,
				top: position.y,
				maxHeight: WINDOW_MAX_HEIGHT,
				overflowY: "auto",
				scrollbarWidth: "none",
				transform: CSS.Translate.toString(transform)
			}}
			onScroll={handleScroll}
		>
			<div
				{...listeners}
				{...attributes}
				className={`backdrop-glass-thin sticky top-0 z-10 flex select-none items-center justify-between gap-4 p-2 pl-4 pt-3 ${
					isDragging ? "cursor-grabbing" : "cursor-grab"
				}`}
				style={{
					maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
					background: "linear-gradient(to bottom, hsl(var(--secondary-bg) / 0.9) 0%, transparent 100%)"
				}}
			>
				<span className="text-base font-semibold">История</span>
				<div className="flex flex-row items-center">
					<IconButton icon={GitCompare} size="sm" variant="text" />
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

export const DraggableWindow = () => {
	const position = useWindowPositionStore((state) => state.position);
	const setPosition = useWindowPositionStore((state) => state.setPosition);
	const [isOpen, setIsOpen] = useState(false);
	const toggleButtonRef = useRef<HTMLButtonElement>(null);

	const handleDragEnd = (event: DragEndEvent) => {
		if (!position) return;
		setPosition({
			x: position.x + event.delta.x,
			y: position.y + event.delta.y
		});
	};

	const handleToggle = () => {
		if (!isOpen && !position) {
			const buttonRect = toggleButtonRef.current?.getBoundingClientRect();
			if (buttonRect) {
				setPosition({
					x: buttonRect.right - WINDOW_WIDTH,
					y: buttonRect.top - WINDOW_MAX_HEIGHT - WINDOW_GAP
				});
			}
		}
		setIsOpen((prev) => !prev);
	};

	return (
		<div className="relative h-screen w-full overflow-hidden bg-alpha-80">
			<DndContext onDragEnd={handleDragEnd}>{isOpen && <Window onClose={() => setIsOpen(false)} />}</DndContext>
			<IconButton
				ref={toggleButtonRef}
				className="absolute bottom-40 right-40"
				icon={History}
				variant="outline"
				onClick={handleToggle}
			/>
		</div>
	);
};
