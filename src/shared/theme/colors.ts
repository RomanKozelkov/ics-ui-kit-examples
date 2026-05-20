/**
 * Превращает значение CSS-переменной HSL-триплета в строку `hsla(...)`.
 *
 * Применяется когда цвет HSL-триплета из CSS-переменной UI Kit нужен в JS (не в CSS): например, при рисовании
 * на `<canvas>`, генерации SVG или передаче цветов в графические библиотеки
 * (ECharts, Chart.js и т.п.).
 *
 * Ожидаемый формат входа — HSL-триплет, как хранится в CSS-переменных темы:
 * `"H S% L%"` (например, `"220 90% 50%"`), без обёртки `hsl(...)`.
 *
 * @param hslTriplet Значение CSS-переменной вида `"220 90% 50%"`.
 * @param alpha Альфа-канал в диапазоне 0..1. По умолчанию `1`.
 * @param fallback Резервный триплет, если `hslTriplet` пустой. По умолчанию `"0 0% 50%"` (серый).
 * @returns Строка `hsla(h, s%, l%, a)`, готовая к использованию как цвет.
 *
 * @example
 * const [chart1] = useThemeTokens(['--chart-1']);
 * ctx.strokeStyle = tokenToHsla(chart1);
 * ctx.fillStyle = tokenToHsla(chart1, 0.2);
 */
export function tokenToHsla(hslTriplet: string, alpha = 1, fallback = "0 0% 50%"): string {
	const [h, s, l] = (hslTriplet || fallback).trim().split(/\s+/);
	return `hsla(${h}, ${s}, ${l}, ${alpha})`;
}
