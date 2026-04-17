import { MultiSelect } from "ics-ui-kit/components/search-select";
import type { LoadOptionsParams, SearchSelectOption } from "ics-ui-kit/components/search-select";

const DISTRIBUTORS = [
	{ value: "id-1", label: "ООО Фармалогистика" },
	{ value: "id-2", label: "ЗАО Биотек" },
	{ value: "id-3", label: "ООО Катрен" },
	{ value: "id-4", label: "ЗАО СИА Интернейшнл" },
	{ value: "id-5", label: "ООО Протек" }
];

const loadDistributors = async (params: LoadOptionsParams) => {
	return {
		options: DISTRIBUTORS.filter((o) =>
			o.label.toLowerCase().includes(params.searchQuery.toLowerCase())
		)
	};
};

export function FilterDistr() {
	return (
		<label className="flex flex-col gap-2 space-y-0">
			<span className="text-sm font-medium leading-none text-primary-fg">Дистрибьюторы</span>
			<MultiSelect
				loadOptions={loadDistributors}
				onChange={(options: SearchSelectOption[]) => {
					console.log("onChange", options);
				}}
			/>
		</label>
	);
}
