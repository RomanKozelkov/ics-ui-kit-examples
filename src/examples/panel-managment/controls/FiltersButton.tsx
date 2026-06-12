import { Popover, PopoverContent, PopoverTrigger } from "ics-ui-kit/components/popover";
import { Button, TriggerButton } from "ics-ui-kit/components/button";
import { Counter } from "ics-ui-kit/components/counter";
import { MultiSelect } from "ics-ui-kit/components/search-select";
import type { SearchSelectOption } from "ics-ui-kit/components/search-select";
import { Filter, RotateCcw } from "lucide-react";
import { FilterField } from "../../../shared/bi-dashboard/ui/FilterField";
import { usePanelStore } from "../store/usePanelStore";
import { BRAND_OPTIONS, CHANNEL_OPTIONS, CLIENT_OPTIONS } from "../data/options";

// Статичный загрузчик для MultiSelect: фильтрует готовый список по строке поиска.
const makeStaticLoader = (options: SearchSelectOption[]) => async ({ searchQuery }: { searchQuery: string }) => ({
	options: options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
});

const loadChannels = makeStaticLoader(CHANNEL_OPTIONS);
const loadClients = makeStaticLoader(CLIENT_OPTIONS);
const loadBrands = makeStaticLoader(BRAND_OPTIONS);

export function FiltersButton() {
	const channels = usePanelStore((s) => s.channels);
	const clients = usePanelStore((s) => s.clients);
	const brands = usePanelStore((s) => s.brands);
	const setChannels = usePanelStore((s) => s.setChannels);
	const setClients = usePanelStore((s) => s.setClients);
	const setBrands = usePanelStore((s) => s.setBrands);
	const resetFilters = usePanelStore((s) => s.resetFilters);

	const activeFilterCount = channels.length + clients.length + brands.length;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<TriggerButton startIcon={Filter}>
					Фильтры
					{activeFilterCount > 0 && (
						<Counter variant="secondary" status="default" className="rounded-full tabular-nums">
							{activeFilterCount}
						</Counter>
					)}
				</TriggerButton>
			</PopoverTrigger>
			<PopoverContent align="start" collisionPadding={16} className="w-80">
				<div className="flex flex-col gap-4">
					<FilterField label="Канал">
						<MultiSelect
							value={channels}
							onChange={setChannels}
							loadOptions={loadChannels}
							placeholder="Все каналы"
							searchPlaceholder="Найти канал"
						/>
					</FilterField>
					<FilterField label="Клиент">
						<MultiSelect
							value={clients}
							onChange={setClients}
							loadOptions={loadClients}
							placeholder="Все клиенты"
							searchPlaceholder="Найти клиента"
						/>
					</FilterField>
					<FilterField label="Бренд">
						<MultiSelect
							value={brands}
							onChange={setBrands}
							loadOptions={loadBrands}
							placeholder="Все бренды"
							searchPlaceholder="Найти бренд"
						/>
					</FilterField>
					{activeFilterCount > 0 && (
						<Button variant="link" startIcon={RotateCcw} className="self-start px-0" onClick={resetFilters}>
							Сбросить фильтры
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
