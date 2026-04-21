import { Card } from "ics-ui-kit/components/card";
import { Badge } from "ics-ui-kit/components/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useValueCard } from "./useCardsData";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { MetricCardHeader } from "../components/MetricCardHeader";
import { MetricCardFooter } from "../components/MetricCardFooter";

const currencyFormatters: Record<string, Intl.NumberFormat> = {
	USD: new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
		currencyDisplay: "narrowSymbol"
	}),
	RUB: new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency: "RUB",
		maximumFractionDigits: 0,
		currencyDisplay: "narrowSymbol"
	})
};

export function PrimarySalesValueCard() {
	const currency = useFiltersStore((s) => s.currency);
	const year = useFiltersStore((s) => s.year);
	const { data, isLoading } = useValueCard();
	const loading = isLoading || !data;
	const symbol = currency === "USD" ? "$" : "₽";
	const cf = currencyFormatters[currency === "USD" ? "USD" : "RUB"];
	const positive = (data?.yoy ?? 0) >= 0;

	return (
		<Card className="gap-4 py-6">
			<MetricCardHeader
				description={`Primary Sales, ${symbol}`}
				title={data ? cf.format(data.current ?? 0) : null}
				action={
					data?.yoy != null && (
						<Badge
							status={positive ? "success" : "error"}
							size="sm"
							startIcon={positive ? TrendingUp : TrendingDown}
						>
							{positive ? "+" : ""}
							{data.yoy.toFixed(1)}%
						</Badge>
					)
				}
				isLoading={loading}
			/>
			<MetricCardFooter isLoading={loading}>
				PY ({year - 1}): <span className="text-primary-fg">{cf.format(data?.previous ?? 0)}</span>
			</MetricCardFooter>
		</Card>
	);
}
