export function ProfileCard() {
	return (
		<>
			<div className="flex items-center gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/30 text-sm font-semibold text-white">
					АК
				</div>
				<div className="flex flex-col gap-0.5">
					<span className="text-sm font-semibold leading-tight text-white">Алексей Кириллов</span>
					<span className="text-xs text-white/70">Frontend Developer</span>
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<span className="text-xs text-white/70">email@example.com</span>
				<span className="text-xs text-white/70">Москва, Россия</span>
			</div>
		</>
	);
}
