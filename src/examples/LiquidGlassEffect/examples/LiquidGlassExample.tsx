import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipText,
	TooltipTitle,
	TooltipTrigger
} from "ics-ui-kit/components/tooltip";
import { Button } from "ics-ui-kit/components/button";
import { Info } from "lucide-react";
import { GlassComponent } from "../components/GlassComponent";
import { LiquidGlassPopoverExample } from "./LiquidGlassPopoverExample";
import { ScrollBackground, SectionLabel } from "./shared";

export function LiquidGlassExample() {
	return (
		<section className="flex flex-col gap-4">
			<SectionLabel
				number="2"
				title="Liquid Glass — GlassComponent"
				subtitle="SVG displacement map + backdrop-filter — живая деформация поверхности, но сложнее - нужно настраивать + выделять компонент или хук"
			/>

			<div className="grid grid-cols-2 gap-4">
				<ScrollBackground>
					<GlassComponent className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4">
						<span className="text-sm font-bold text-white">Логотип</span>
						<div className="flex gap-4">
							<span className="text-xs text-white/70">Главная</span>
							<span className="text-xs text-white/70">О нас</span>
						</div>
					</GlassComponent>
				</ScrollBackground>

				<ScrollBackground>
					<GlassComponent className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-around px-5 py-4">
						{["🏠", "🔍", "＋", "🔔", "👤"].map((icon) => (
							<span key={icon} className="text-lg">
								{icon}
							</span>
						))}
					</GlassComponent>
				</ScrollBackground>

				<ScrollBackground>
					<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
						<GlassComponent className="pointer-events-auto w-56 rounded-2xl border border-white/30 p-5">
							<p className="mb-1 text-xs">Статус проекта</p>
							<p className="text-sm font-semibold">Glass готов ✓</p>
							<p className="mt-1 text-xs">Сегодня, 14:32</p>
						</GlassComponent>
					</div>
				</ScrollBackground>

				<ScrollBackground>
					<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
						<div className="pointer-events-auto flex flex-col items-center gap-3">
							<TooltipProvider>
								<Tooltip open>
									<TooltipTrigger asChild>
										<Button variant="secondary" className="gap-2">
											<Info className="size-4" />
											Наведи на меня
										</Button>
									</TooltipTrigger>
									<TooltipContent className="border-0 bg-transparent p-0 shadow-none" sideOffset={8}>
										<GlassComponent className="rounded-xl border border-white/30 px-3 py-2">
											<TooltipTitle>Стеклянный тултип</TooltipTitle>
											<TooltipText>Контент под тултипом преломляется</TooltipText>
										</GlassComponent>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>
				</ScrollBackground>
			</div>

			<LiquidGlassPopoverExample />
		</section>
	);
}
