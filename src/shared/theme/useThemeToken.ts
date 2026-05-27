import { useSyncExternalStore, useMemo, useRef } from "react";
import { subscribe, getToken, getSnapshotVersion, getServerSnapshot } from "./tokenStore";

/**
 * Читает значение CSS-переменной темы и подписывает компонент на её изменения.
 */
export function useThemeToken(name: string): string {
	useSyncExternalStore(subscribe, getSnapshotVersion, getServerSnapshot);
	return getToken(name);
}

/**
 * Читает значения CSS-переменных темы и подписывает компонент на их изменения.
 *
 * Применяется когда токены темы нужны в JS (не в CSS): например, для рисования
 * на `<canvas>`, генерации SVG, передачи цветов в сторонние библиотеки графиков
 * и т.п. При смене темы компонент перерисуется с новыми значениями.
 *
 * @param names Кортеж имён CSS-переменных (с префиксом `--`). Помимо переменных темы, можно передавать любое CSS-свойство `<html>`.
 * @returns Кортеж строковых значений в том же порядке, что и `names`.
 *
 * @example
 * const [errorFg] = useThemeTokens(['--status-error-fg'] as const);
 *
 * useEffect(() => {
 *   const ctx = canvasRef.current!.getContext('2d')!;
 *   ctx.fillStyle = errorFg;
 *   ctx.fillRect(0, 0, 100, 100);
 * }, [errorFg]);
 */
export function useThemeTokens<T extends readonly string[]>(names: T): { [K in keyof T]: string } {
	const version = useSyncExternalStore(subscribe, getSnapshotVersion, getServerSnapshot);

	const key = names.join("|");
	const lastKey = useRef<string>("");
	const lastVersion = useRef<object | null>(null);
	const lastResult = useRef<string[]>([]);

	return useMemo(() => {
		if (lastKey.current === key && lastVersion.current === version) {
			return lastResult.current as { [K in keyof T]: string };
		}
		const next = names.map(getToken);
		lastKey.current = key;
		lastVersion.current = version;
		lastResult.current = next;
		return next as { [K in keyof T]: string };
	}, [key, version]);
}

/**
 * Читает значения CSS-переменных темы как объект-словарь и подписывает компонент на их изменения.
 *
 * То же, что и `useThemeTokens`, но возвращает объект, где ключ — имя CSS-переменной,
 * а значение — её строковое значение. Используется когда нужен доступ по имени, а не по индексу.
 * При смене темы компонент перерисуется с новыми значениями.
 *
 * @param names Кортеж имён CSS-переменных (с префиксом `--`). Помимо переменных темы, можно передавать любое CSS-свойство `<html>`.
 * @returns Объект, где ключи — имена из `names`, а значения — соответствующие строковые значения.
 *
 * @example
 * const { '--status-error-fg': errorFg, '--status-success-fg': successFg } =
 *   useThemeTokensRecord(['--status-error-fg', '--status-success-fg'] as const);
 *
 * useEffect(() => {
 *   const ctx = canvasRef.current!.getContext('2d')!;
 *   ctx.fillStyle = errorFg;
 *   ctx.fillRect(0, 0, 100, 100);
 * }, [errorFg]);
 */
export function useThemeTokensRecord<T extends readonly string[]>(names: T): { [K in T[number]]: string } {
	const values = useThemeTokens(names);
	return useMemo(() => {
		const out = {} as { [K in T[number]]: string };
		names.forEach((n, i) => {
			out[n as T[number]] = values[i];
		});
		return out;
	}, [values]);
}

export function prefetchThemeTokens(names: readonly string[]): void {
	names.forEach(getToken);
}
