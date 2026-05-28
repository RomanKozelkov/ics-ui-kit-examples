import { useCallback, useMemo, useRef, useState } from "react";
import { Popover, PopoverTrigger } from "ics-ui-kit/components/popover";
import { Command, CommandList } from "ics-ui-kit/components/command";
import {
	AsyncSearchSelectContent,
	SearchSelectContent,
	SearchSelectInput,
	SearchSelectTrigger
} from "ics-ui-kit/components/search-select";
import type { SearchSelectOption } from "ics-ui-kit/components/search-select";
import { Counter } from "ics-ui-kit/components/counter";

type LoadingState = "idle" | "loading" | "success" | "error";

export interface MultiSelectControlledProps<T extends SearchSelectOption = SearchSelectOption> {
	/** Выбранные опции */
	value: T[];
	/** Опции для отображения (уже загруженные, напр. из useQuery) */
	options: T[];
	/** Идёт загрузка опций */
	isLoading?: boolean;
	/** Ошибка загрузки */
	error?: string | null;
	/** Изменение выбора */
	onChange: (options: T[]) => void;
	/** Изменение поискового запроса (дебаунс — на стороне вызывающего) */
	onSearch?: (query: string) => void;
	/** Открыт ли поповер (controlled) */
	open: boolean;
	/** Изменение состояния открытия */
	onOpenChange: (open: boolean) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	loadingText?: string;
	errorText?: string;
	disabled?: boolean;
	invalid?: boolean;
	className?: string;
}

/**
 * Контролируемый MultiSelect: принимает готовые options + состояния загрузки
 * напрямую (без loadOptions/useAsyncDataLoader), чтобы данными управлял
 * вызывающий через react-query.
 *
 * Выбранные опции поднимаются наверх списка, но порядок фиксируется на момент
 * открытия поповера — внутри открытой сессии клики не двигают позиции (нет
 * прыжков скролла). Пересортировка происходит при следующем открытии.
 *
 * Триггер показывает счётчик выбранных ("Выбрано: N").
 */
export function MultiSelectControlled<T extends SearchSelectOption = SearchSelectOption>(
	props: MultiSelectControlledProps<T>
) {
	const {
		value,
		options,
		isLoading,
		error,
		onChange,
		onSearch,
		open,
		onOpenChange,
		placeholder = "Выберите значение",
		searchPlaceholder = "Найти",
		emptyText = "Результатов не найдено",
		loadingText = "Загружаем...",
		errorText = "Ошибка загрузки",
		disabled,
		invalid,
		className
	} = props;

	const [searchQuery, setSearchQuery] = useState("");

	// Снепшот множества выбранных на момент открытия — порядок стабилен пока открыто.
	const sortKeyRef = useRef<Set<string>>(new Set());
	if (!open) sortKeyRef.current = new Set(value.map((o) => String(o.value)));

	const sortedOptions = useMemo(() => {
		const pinned = sortKeyRef.current;
		if (pinned.size === 0) return options;
		return [...options].sort((a, b) => {
			const aPinned = pinned.has(String(a.value)) ? 0 : 1;
			const bPinned = pinned.has(String(b.value)) ? 0 : 1;
			return aPinned - bPinned;
		});
	}, [options, open]);

	const isSelected = useCallback((option: T) => value.some((o) => o.value === option.value), [value]);

	const handleSelect = useCallback(
		(label: string) => {
			const option = sortedOptions.find((o) => o.label === label);
			if (!option) return;
			onChange(
				value.some((o) => o.value === option.value)
					? value.filter((o) => o.value !== option.value)
					: [...value, option]
			);
		},
		[sortedOptions, value, onChange]
	);

	const handleSearchChange = useCallback(
		(query: string) => {
			setSearchQuery(query);
			onSearch?.(query);
		},
		[onSearch]
	);

	const loadingState: LoadingState = error ? "error" : isLoading ? "loading" : "success";

	return (
		<div className={className}>
			<Popover open={open} onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>
					<SearchSelectTrigger
						disabled={disabled}
						open={open}
						placeholder={placeholder}
						invalid={invalid}
						onClear={value.length > 0 ? () => onChange([]) : undefined}
					>
						{value.length > 0 ? (
							<div className="flex h-6 items-center gap-1 pl-1.5 text-sm">
								<span>Выбрано:</span>
								<Counter variant="secondary" status="default" className="rounded-full tabular-nums">
									{value.length}
								</Counter>
							</div>
						) : undefined}
					</SearchSelectTrigger>
				</PopoverTrigger>
				<SearchSelectContent>
					<Command shouldFilter={false}>
						<SearchSelectInput placeholder={searchPlaceholder} onValueChange={handleSearchChange} />
						<CommandList className="p-1">
							<AsyncSearchSelectContent
								options={sortedOptions}
								loadingState={loadingState}
								error={error ?? null}
								isSelected={isSelected}
								searchQuery={searchQuery}
								loadMode="auto"
								minInputLength={0}
								onSelect={handleSelect}
								loadingText={loadingText}
								errorText={errorText}
								inputHintText=""
								emptyText={emptyText}
							/>
						</CommandList>
					</Command>
				</SearchSelectContent>
			</Popover>
		</div>
	);
}
