/** Иконка курсора — общая для тулбара на карте и подсказки. Остальные берутся из lucide. */

const base = {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.9,
	strokeLinecap: "round" as const,
	strokeLinejoin: "round" as const
};

export const CursorIcon = ({ size = 14 }: { size?: number }) => (
	<svg {...base} width={size} height={size}>
		<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
		<path d="m13 13 6 6" />
	</svg>
);
