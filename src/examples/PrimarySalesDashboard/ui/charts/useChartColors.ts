import { useMemo } from "react";
import { tokenToHsla, useThemeToken, useThemeTokensRecord } from "../../../../shared/theme";

const TOKENS = [
	"--muted",
	"--primary-fg",
	"--primary-border",
	"--primary-bg",
	"--chart-1",
	"--chart-2",
	"--chart-3",
	"--chart-4",
	"--chart-5"
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

/**
 * Возвращает палитру цветов для чартов дашборда, синхронизированную с текущей темой.
 *
 * Для чего нужен: Recharts/SVG принимают цвета строкой, а тема дашборда живёт в CSS-переменных
 * (`--chart-1`, `--primary-fg`, …) и меняется на лету (light/dark, смена темы). Прямое чтение
 * `getComputedStyle` в чартах не реагирует на смену темы и не даёт прозрачности. Хук подписывается
 * на токены через `useThemeTokensRecord`, переводит HSL-триплеты в `hsla(...)` через `tokenToHsla`
 * и реактивно обновляет цвета чарта при переключении темы.
 *
 * Пример (`hsla` строки готовы к передаче в `stroke`/`fill`):
 *  `series.primary`     → `'hsla(220 90% 56% / 1)'`
 *  `series.primarySoft` → `'hsla(220 90% 56% / 0.35)'`
 */
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
				primary: tokenToHsla(t["--chart-1"]),
				primarySoft: tokenToHsla(t["--chart-1"], 0.35),
				primaryFade: tokenToHsla(t["--chart-1"], 0),
				muted: tokenToHsla(t["--chart-3"]),
				positive: tokenToHsla(t["--chart-1"]),
				negative: tokenToHsla(t["--chart-2"])
			}
		}),
		[t]
	);
}
