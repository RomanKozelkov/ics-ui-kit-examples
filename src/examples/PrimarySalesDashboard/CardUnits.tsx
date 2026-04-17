import { Card, CardTitle } from "ics-ui-kit/components/card";
import { Icon } from "ics-ui-kit/components/icon";
import { Package, TrendingUp } from "lucide-react";

const CY_VALUE = 2_591_667;
const PY_VALUE = 2_483_333;
const YOY = ((CY_VALUE - PY_VALUE) / PY_VALUE) * 100;

const nf = new Intl.NumberFormat("ru-RU");

export function PrimarySalesUnitsCard() {
	const positive = YOY >= 0;
	return (
		<Card className="gap-3">
			<div className="flex items-start justify-between">
				<CardTitle className="mb-0">Primary Sales, Units</CardTitle>
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-status-warning-bg text-status-warning-fg">
					<Icon icon={Package} size="sm" />
				</div>
			</div>
			<div className="flex items-baseline gap-2">
				<span className="text-2xl font-semibold tracking-tight text-primary-fg">{nf.format(CY_VALUE)}</span>
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
				PY (2024): <span className="text-primary-fg">{nf.format(PY_VALUE)}</span>
			</div>
		</Card>
	);
}
