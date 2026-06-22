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
