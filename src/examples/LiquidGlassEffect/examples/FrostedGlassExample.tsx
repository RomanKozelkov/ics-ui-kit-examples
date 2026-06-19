import { Button } from "ics-ui-kit/components/button";
import { ScrollBackground, SectionLabel } from "./shared";
import { FrostedGlassPopoverExample } from "./FrostedGlassPopoverExample";

const frostedStyle = {
	backdropFilter: "blur(16px) saturate(180%)",
	WebkitBackdropFilter: "blur(16px) saturate(180%)",
	background: "rgba(255,255,255,0.12)",
	border: "1px solid rgba(255,255,255,0.2)"
} as React.CSSProperties;

export function FrostedGlassExample() {
	return (
		<section className="flex flex-col gap-4">
			<SectionLabel
				number="1"
				title="Frosted Glass — чистый CSS"
				subtitle="backdrop-filter: blur() saturate() — максимальная кастомизация, нет зависимостей"
			/>

			<div className="grid grid-cols-2 gap-4">
				<ScrollBackground>
					<nav
						style={frostedStyle}
						className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4"
					>
						<span className="text-sm font-bold">Логотип</span>
						<div className="flex gap-4">
							<span className="text-xs">Главная</span>
							<span className="text-xs">О нас</span>
						</div>
					</nav>
				</ScrollBackground>

				<ScrollBackground>
					<footer
						style={frostedStyle}
						className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-around px-5 py-4"
					>
						{["🏠", "🔍", "＋", "🔔", "👤"].map((icon) => (
							<span key={icon} className="text-lg">
								{icon}
							</span>
						))}
					</footer>
				</ScrollBackground>

				<ScrollBackground>
					<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
						<div style={{ ...frostedStyle, borderRadius: 20 }} className="pointer-events-auto w-56 p-5">
							<p className="mb-1 text-xs">Статус проекта</p>
							<p className="text-sm font-semibold">Glass готов ✓</p>
							<p className="mt-1 text-xs">Сегодня, 14:32</p>
						</div>
					</div>
				</ScrollBackground>

				<ScrollBackground>
					<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
						<div className="pointer-events-auto flex flex-col items-center gap-3">
							<div style={{ ...frostedStyle, borderRadius: 12 }} className="px-4 py-2 text-center">
								<p className="text-xs font-semibold">Стеклянный тултип</p>
								<p className="text-xs">подсказка поверх контента</p>
							</div>
							<Button variant="secondary" size="sm">
								Кнопка под тултипом
							</Button>
						</div>
					</div>
				</ScrollBackground>
			</div>

			<FrostedGlassPopoverExample />
		</section>
	);
}
