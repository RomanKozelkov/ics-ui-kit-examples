import { useThemeToken } from "../../theme";

export function useChartFont(): string {
	return useThemeToken("font-family");
}
