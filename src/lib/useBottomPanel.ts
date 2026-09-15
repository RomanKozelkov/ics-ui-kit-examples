import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ics-examples:bottom-panel";

/**
 * Состояние нижней панели страницы примера: по умолчанию свёрнута, выбор пользователя
 * запоминается между визитами.
 *
 * Значение читается после монтирования, а не в инициализаторе состояния: на сервере
 * `localStorage` недоступен, а расхождение серверной и клиентской разметки ломает гидрацию.
 * Тот же приём используется в `useTheme`.
 */
export function useBottomPanel(): [boolean, (next: boolean) => void] {
	const [open, setOpenState] = useState(false);

	useEffect(() => {
		try {
			setOpenState(window.localStorage.getItem(STORAGE_KEY) === "open");
		} catch {
			// Приватный режим или запрет хранилища — остаёмся на значении по умолчанию.
		}
	}, []);

	const setOpen = useCallback((next: boolean) => {
		setOpenState(next);
		try {
			window.localStorage.setItem(STORAGE_KEY, next ? "open" : "closed");
		} catch {
			// Записать не удалось — состояние живёт только до перезагрузки.
		}
	}, []);

	return [open, setOpen];
}
