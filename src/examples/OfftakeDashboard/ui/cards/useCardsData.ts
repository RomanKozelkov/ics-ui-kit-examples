import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import type { Metric } from "../../stores/useFiltersStore";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { offtakeKeys } from "../../api/queryKeys";
import { fetchCards, type CardsRaw } from "../../api/fetchers";

export type CardView = {
	current: number | null;
	previous: number | null;
	yoy: number | null;
};

const FIELD_BY_METRIC: Record<Metric, keyof CardsRaw["rows"][number]> = {
	RUB: "valueRub",
	USD: "valueUsd",
	Units: "units"
};

const yoy = (cur: number | null, prev: number | null) => (cur != null && prev ? ((cur - prev) / prev) * 100 : null);

const pickCurrent = (raw: CardsRaw, field: keyof CardsRaw["rows"][number]) =>
	(raw.rows.find((r) => r.year === raw.year)?.[field] as number | undefined) ?? null;

const pickPrevious = (raw: CardsRaw, field: keyof CardsRaw["rows"][number]) =>
	(raw.rows.find((r) => r.year === raw.year - 1)?.[field] as number | undefined) ?? null;

export function useCardsData() {
	const input = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period,
			counterparties: s.counterparties,
			contracts: s.contracts,
			salesChannels: s.salesChannels,
			brands: s.brands
		}))
	);

	return useQuery({
		queryKey: offtakeKeys.cards(input),
		queryFn: () => fetchCards(input),
		placeholderData: keepPreviousData
	});
}

export function useCard(metric: Metric): { data: CardView | undefined; isStale: boolean } {
	const { data, isPlaceholderData } = useCardsData();
	if (!data) return { data: undefined, isStale: false };
	const field = FIELD_BY_METRIC[metric];
	const current = pickCurrent(data, field);
	const previous = pickPrevious(data, field);
	return { data: { current, previous, yoy: yoy(current, previous) }, isStale: isPlaceholderData };
}
