import { useState } from "react";
import type { QueryKey } from "@tanstack/react-query";
import type { SearchSelectOption } from "ics-ui-kit/components/search-select";
import { FilterField } from "../ui/FilterField";
import { useFilterOptions } from "../../hooks/useFilterOptions";
import { MultiSelectControlled } from "../../components/MultiSelectControlled";

/** Справочники меняются редко — кэшируем загруженные опции на 5 минут. */
const DEFAULT_STALE_TIME = 5 * 60 * 1000;

type DictionaryFilterProps<T extends SearchSelectOption> = {
	label: string;
	value: T[];
	onChange: (value: T[]) => void;
	/** Фабрика ключа react-query по строке поиска (ключи дашборда). */
	queryKey: (search: string) => QueryKey;
	/** Загрузчик опций справочника (fetcher дашборда). */
	queryFn: (search: string) => Promise<T[]>;
	staleTime?: number;
};

/**
 * Фильтр-справочник: подпись + мультиселект с серверным поиском.
 * Источник данных (ключи/fetcher) и стор приходят пропсами — компонент про дашборд не знает.
 */
export function DictionaryFilter<T extends SearchSelectOption>({
	label,
	value,
	onChange,
	queryKey,
	queryFn,
	staleTime = DEFAULT_STALE_TIME
}: DictionaryFilterProps<T>) {
	const [open, setOpen] = useState(false);
	const { options, isLoading, error, onSearch } = useFilterOptions({
		open,
		queryKey,
		queryFn,
		staleTime
	});

	return (
		<FilterField label={label}>
			<MultiSelectControlled
				value={value}
				options={options}
				isLoading={isLoading}
				error={error}
				onChange={onChange}
				onSearch={onSearch}
				open={open}
				onOpenChange={setOpen}
			/>
		</FilterField>
	);
}
