import { Card } from "ics-ui-kit/components/card";
import { Badge } from "ics-ui-kit/components/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useUnitsCard } from "./useCardsData";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { MetricCardHeader } from "../components/MetricCardHeader";
import { MetricCardFooter } from "../components/MetricCardFooter";

const nf = new Intl.NumberFormat("ru-RU");

export function PrimarySalesUnitsCard() {
	const year = useFiltersStore((s) => s.year);
	const { data, isLoading } = useUnitsCard();
	const loading = isLoading || !data;
	const positive = (data?.yoy ?? 0) >= 0;

	return (
		<Card className="gap-4 py-6">
			<MetricCardHeader
				description="Primary Sales, Units"
				title={data ? nf.format(data.current ?? 0) : null}
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
				PY ({year - 1}): <span className="text-primary-fg">{nf.format(data?.previous ?? 0)}</span>
			</MetricCardFooter>
		</Card>
	);
}
