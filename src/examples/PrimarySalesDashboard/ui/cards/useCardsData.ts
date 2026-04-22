import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { primarySalesKeys } from "../../api/queryKeys";
import { fetchCards, type CardsRaw } from "../../api/fetchers";

export type CardView = {
	current: number | null;
	previous: number | null;
	yoy: number | null;
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
			period: s.period
		}))
	);

	return useQuery({
		queryKey: primarySalesKeys.cards(input),
		queryFn: () => fetchCards(input)
	});
}

export function useValueCard(): { data: CardView | undefined; isLoading: boolean } {
	const currency = useFiltersStore((s) => s.currency);
	const { data, isLoading } = useCardsData();
	if (!data) return { data: undefined, isLoading };
	const field = currency === "USD" ? "valueUsd" : "valueRub";
	const current = pickCurrent(data, field);
	const previous = pickPrevious(data, field);
	return { data: { current, previous, yoy: yoy(current, previous) }, isLoading };
}

export function useUnitsCard(): { data: CardView | undefined; isLoading: boolean } {
	const { data, isLoading } = useCardsData();
	if (!data) return { data: undefined, isLoading };
	const current = pickCurrent(data, "units");
	const previous = pickPrevious(data, "units");
	return { data: { current, previous, yoy: yoy(current, previous) }, isLoading };
}
