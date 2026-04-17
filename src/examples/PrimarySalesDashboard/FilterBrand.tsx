import { MultiSelect } from "ics-ui-kit/components/search-select";
import type { LoadOptionsParams, SearchSelectOption } from "ics-ui-kit/components/search-select";

const BRANDS = [
	{ value: "id-1", label: "Нурофен" },
	{ value: "id-2", label: "Арбидол" },
	{ value: "id-3", label: "Эссенциале" },
	{ value: "id-4", label: "Мезим" },
	{ value: "id-5", label: "Линекс" },
	{ value: "id-6", label: "Но-шпа" },
	{ value: "id-7", label: "Пантенол" },
	{ value: "id-8", label: "Терафлекс" },
	{ value: "id-9", label: "Омез" },
	{ value: "id-10", label: "Аквамарис" }
];

const loadBrands = async (params: LoadOptionsParams) => {
	return {
		options: BRANDS.filter((o) =>
			o.label.toLowerCase().includes(params.searchQuery.toLowerCase())
		)
	};
};

export function FilterBrand() {
	return (
		<label className="flex flex-col gap-2 space-y-0">
			<span className="text-sm font-medium leading-none text-primary-fg">Бренды</span>
			<MultiSelect
				loadOptions={loadBrands}
				onChange={(options: SearchSelectOption[]) => {
					console.log("onChange", options);
				}}
			/>
		</label>
	);
}
