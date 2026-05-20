import { useMemo } from "react";
import { tokenToHsla, useThemeToken, useThemeTokensRecord } from "../../../../shared/theme";

const TOKENS = [
	"--muted",
	"--primary-fg",
	"--primary-border",
	"--primary-bg",
	"--status-info",
	"--status-success-fg",
	"--status-error-fg"
] as const;

export interface ChartColors {
	text: string;
	textStrong: string;
	grid: string;
	tooltipBg: string;
	tooltipFg: string;
	series: {
		primary: string;
		primarySoft: string;
		primaryFade: string;
		muted: string;
		positive: string;
		negative: string;
	};
}

export function useChartColors(): ChartColors {
	const t = useThemeTokensRecord(TOKENS);
	return useMemo<ChartColors>(
		() => ({
			text: tokenToHsla(t["--muted"]),
			textStrong: tokenToHsla(t["--primary-fg"]),
			grid: tokenToHsla(t["--primary-border"]),
			tooltipBg: tokenToHsla(t["--primary-fg"]),
			tooltipFg: tokenToHsla(t["--primary-bg"]),
			series: {
				primary: tokenToHsla(t["--status-info"]),
				primarySoft: tokenToHsla(t["--status-info"], 0.35),
				primaryFade: tokenToHsla(t["--status-info"], 0),
				muted: tokenToHsla(t["--muted"]),
				positive: tokenToHsla(t["--status-success-fg"]),
				negative: tokenToHsla(t["--status-error-fg"])
			}
		}),
		[t]
	);
}
