import { Card } from "ics-ui-kit/components/card";
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

const SCROLL_ITEMS = Array.from({ length: 20 }, (_, i) => i);

export function LiquidGlassComponentExample() {
	return (
		<section className="flex flex-col gap-4">
			<h2 className="text-lg font-semibold text-primary-fg">GlassComponent</h2>

			<div className="relative h-[420px] overflow-hidden rounded-2xl">
				<div className="inset-0 h-full overflow-y-auto">
					<div className="flex flex-col gap-3">
						{SCROLL_ITEMS.map((i) => (
							<div
								key={i}
								className="flex h-16 items-center rounded-xl border border-white/20 bg-gradient-to-r from-violet-400/40 to-indigo-400/40 px-4"
							>
								<span className="text-sm text-primary-fg/60">Строка {i + 1}</span>
							</div>
						))}
					</div>
				</div>

				<GlassComponent className="absolute inset-x-0 top-0 z-10 m-3 rounded-2xl border border-white/30">
					<Card className="border-0 bg-transparent shadow-none">
						<p className="text-sm font-medium text-primary-fg">Карточка поверх скролла</p>
						<p className="mt-1 text-xs text-secondary-fg">
							Скрольте фон — стеклянный эффект преломляет контент под ней
						</p>
					</Card>
				</GlassComponent>

				<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-start pl-14">
					<div className="pointer-events-auto flex flex-col items-center gap-4">
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
			</div>

			<LiquidGlassPopoverExample />
		</section>
	);
}
