import { Card, CardTitle } from "ics-ui-kit/components/card";
import { Icon } from "ics-ui-kit/components/icon";
import { DollarSign, TrendingUp } from "lucide-react";

const CY_VALUE = 38.4;
const PY_VALUE = 35.3;
const YOY = ((CY_VALUE - PY_VALUE) / PY_VALUE) * 100;

const CURRENCY_SYMBOL = "₽";

export function PrimarySalesValueCard() {
	const positive = YOY >= 0;
	return (
		<Card className="gap-3">
			<div className="flex items-start justify-between">
				<CardTitle className="mb-0">Primary Sales Value CY</CardTitle>
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-bg text-accent-fg">
					<Icon icon={DollarSign} size="sm" />
				</div>
			</div>
			<div className="flex items-baseline gap-2">
				<span className="text-2xl font-semibold tracking-tight text-primary-fg">
					{CY_VALUE.toFixed(1)}M {CURRENCY_SYMBOL}
				</span>
				<span
					className={
						"flex items-center gap-0.5 text-sm font-medium " +
						(positive ? "text-status-success-fg" : "text-status-error-fg")
					}
				>
					<Icon icon={TrendingUp} size="xs" />
					{positive ? "+" : ""}
					{YOY.toFixed(1)}%
				</span>
			</div>
			<div className="text-xs text-secondary-fg">
				PY (2024): <span className="text-primary-fg">{PY_VALUE.toFixed(1)}M {CURRENCY_SYMBOL}</span>
			</div>
		</Card>
	);
}
