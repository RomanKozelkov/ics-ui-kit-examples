import { Button, IconButton } from "ics-ui-kit/components/button";
import { useState } from "react";
import { Container } from "ics-ui-kit/components/container";
import { Avatar, AvatarImage, AvatarFallback } from "ics-ui-kit/components/avatar";
import { Label } from "ics-ui-kit/components/label";
import { Description } from "ics-ui-kit/components/description";
import { Indicator } from "ics-ui-kit/components/indicator";
import { Text } from "ics-ui-kit/components/text";
import { Filter, GitCompare, Maximize2, X } from "lucide-react";

export const FloatingPanel = () => {
	const [isAtBottom, setIsAtBottom] = useState(false);

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		setIsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center">
			<div
				className="relative flex w-80 flex-col rounded-2xl border border-secondary-bg px-1 py-0 shadow-2xl"
				style={{ maxHeight: 480, overflowY: "auto", scrollbarWidth: "none" }}
				onScroll={handleScroll}
			>
				<div
					className="backdrop-glass-thin sticky top-0 z-10 flex items-center justify-between gap-4 p-2 pl-4 pt-3"
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
						<IconButton icon={X} size="sm" variant="text" />
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
							background:
								"linear-gradient(to bottom, transparent 0%, hsl(var(--secondary-bg) / 0.8) 100%)",
							zIndex: 10
						}}
					/>
				)}
			</div>
		</div>
	);
};
