import { useThemeToken } from "../../../../shared/theme";

export function useChartFont(): string {
	return useThemeToken("font-family");
}
