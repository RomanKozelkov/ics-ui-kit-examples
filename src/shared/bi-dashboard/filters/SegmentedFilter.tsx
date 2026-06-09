import { Fragment } from "react";
import { FieldSegmentedToggleGroup } from "../../components/FieldSegmentedToggleGroup";
import { SegmentedToggleDivider, SegmentedToggleItem } from "../../components/SegmentedToggle";

export type SegmentedOption = {
	value: string;
	/** Подпись на кнопке. По умолчанию равна `value`. */
	label?: string;
};

type SegmentedFilterProps = {
	label: string;
	value: string;
	options: SegmentedOption[];
	onChange: (value: string) => void;
};

/**
 * Поле-переключатель фильтра (год/метрика/источник): подпись + сегментированная группа кнопок.
 * Значение и сеттер приходят из стора дашборда через обёртку — компонент про стор не знает.
 */
export function SegmentedFilter({ label, value, options, onChange }: SegmentedFilterProps) {
	return (
		<FieldSegmentedToggleGroup
			label={label}
			type="single"
			value={value}
			onValueChange={(v) => v && onChange(v)}
		>
			{options.map((opt, i) => (
				<Fragment key={opt.value}>
					{i > 0 && <SegmentedToggleDivider />}
					<SegmentedToggleItem value={opt.value}>{opt.label ?? opt.value}</SegmentedToggleItem>
				</Fragment>
			))}
		</FieldSegmentedToggleGroup>
	);
}
