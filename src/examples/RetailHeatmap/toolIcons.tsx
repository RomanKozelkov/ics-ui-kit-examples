/** Иконки инструментов выделения — общие для тулбара на карте и подсказки в панели. */

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

export const SquareIcon = ({ size = 14 }: { size?: number }) => (
	<svg {...base} width={size} height={size}>
		<rect x="3" y="3" width="18" height="18" rx="2" />
	</svg>
);

export const LassoIcon = ({ size = 14 }: { size?: number }) => (
	<svg {...base} width={size} height={size}>
		<path d="M7 22a5 5 0 0 1-2-4" />
		<path d="M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1" />
		<circle cx="5" cy="16" r="2" />
	</svg>
);

export const PolygonIcon = ({ size = 14 }: { size?: number }) => (
	<svg {...base} width={size} height={size}>
		<path d="m12 2 9 7-3.5 11h-11L3 9z" />
	</svg>
);
