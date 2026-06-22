const SCROLL_ITEMS = Array.from({ length: 20 }, (_, i) => i);

export function ScrollBackground({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative h-[400px] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-400 to-fuchsia-500">
			<div className="absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
				<div className="flex flex-col gap-2 p-4 pb-24 pt-24">
					{SCROLL_ITEMS.map((i) => (
						<div
							key={i}
							className="flex h-14 items-center rounded-xl border border-white/20 bg-white/20 px-4"
						>
							<span className="text-sm font-medium text-white/90">Строка {i + 1}</span>
						</div>
					))}
				</div>
			</div>
			{children}
		</div>
	);
}

export function SectionLabel({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
	return (
		<div className="flex items-start gap-3 pb-1">
			<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-fg/10 text-xs font-bold text-primary-fg">
				{number}
			</span>
			<div>
				<p className="text-sm font-semibold text-primary-fg">{title}</p>
				<p className="text-xs text-secondary-fg">{subtitle}</p>
			</div>
		</div>
	);
}
