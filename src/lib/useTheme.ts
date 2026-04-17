import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

function readTheme(): Theme {
	if (typeof document === "undefined") return "light";
	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
	if (typeof document === "undefined") return;
	document.documentElement.classList.toggle("dark", theme === "dark");
}

export function useTheme(): [Theme, (next: Theme) => void] {
	const [theme, setThemeState] = useState<Theme>("light");

	useEffect(() => {
		setThemeState(readTheme());
	}, []);

	const setTheme = useCallback((next: Theme) => {
		applyTheme(next);
		setThemeState(next);
	}, []);

	return [theme, setTheme];
}
