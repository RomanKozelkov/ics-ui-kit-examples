import { useState } from "react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

interface UseFilterOptionsParams<T> {
	/** Запросы летят только когда поповер открыт */
	open: boolean;
	/** Фабрика ключа по дебаунсированному поиску */
	queryKey: (search: string) => QueryKey;
	/** Загрузчик опций */
	queryFn: (search: string) => Promise<T[]>;
	staleTime?: number;
	debounceMs?: number;
}

/**
 * Загрузка опций фильтра: debounce поиска + react-query с enabled по open.
 * Возвращает то, что нужно MultiSelectControlled (options/isLoading/error)
 * плюс onSearch для ввода.
 */
export function useFilterOptions<T>({
	open,
	queryKey,
	queryFn,
	staleTime,
	debounceMs = 300
}: UseFilterOptionsParams<T>) {
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, debounceMs);

	const { data, isFetching, error } = useQuery({
		queryKey: queryKey(debouncedSearch),
		queryFn: () => queryFn(debouncedSearch),
		enabled: open,
		staleTime
	});

	return {
		options: data ?? [],
		isLoading: isFetching,
		error: error ? "Ошибка загрузки" : null,
		onSearch: setSearch
	};
}
