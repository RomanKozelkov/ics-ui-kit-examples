import { useEffect, useState } from "react";

export function hsl(name: string, alpha?: number) {
	if (typeof window === "undefined") return "transparent";
	const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
	if (!v) return "transparent";
	return alpha != null ? `hsl(${v} / ${alpha})` : `hsl(${v})`;
}

export function getChartTheme() {
	return {
		textPrimary: hsl("--primary-fg"),
		textSecondary: hsl("--secondary-fg"),
		textMuted: hsl("--tertiary-accent"),
		grid: hsl("--secondary-border"),
		gridSoft: hsl("--secondary-border", 0.5),
		tooltipBg: hsl("--inverse-primary-bg"),
		tooltipFg: hsl("--inverse-primary-fg"),
		tooltipBorder: hsl("--inverse-border"),
		info: hsl("--status-info-fg"),
		infoSoft: hsl("--status-info-fg", 0.35),
		infoFade: hsl("--status-info-fg", 0),
		success: hsl("--status-success-fg"),
		error: hsl("--status-error-fg")
	};
}

export function useThemeKey() {
	const [key, setKey] = useState(0);
	useEffect(() => {
		const obs = new MutationObserver(() => setKey((k) => k + 1));
		obs.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme", "style"]
		});
		return () => obs.disconnect();
	}, []);
	return key;
}
