import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";
import { Card } from "ics-ui-kit/components/card";
import { ProgressCircle } from "ics-ui-kit/components/progress-circle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ics-ui-kit/components/tabs";
import {
	brands,
	circleMetrics,
	linearShareHint,
	metricTabs,
	visitSummary,
	type Brand,
	type CircleMetric,
	type MetricTab,
	type MetricTabId
} from "./data";

function getBrand(brandId: string): Brand {
	return brands.find((brand) => brand.id === brandId) ?? brands[0];
}

function formatValue(value: number, unit: string) {
	return unit === "%" ? `${value}%` : `${value} ${unit}`;
}

function Delta({ value, suffix = "" }: { value: number; suffix?: string }) {
	if (value === 0) {
		return <span className="text-xs font-medium text-muted">—</span>;
	}

	const positive = value > 0;
	return (
		<span className={`text-xs font-medium ${positive ? "text-status-success" : "text-status-error"}`}>
			{positive ? "▲" : "▼"} {Math.abs(value)}
			{suffix}
		</span>
	);
}

function StatTile({ value, label }: { value: number; label: string }) {
	return (
		<div className="flex flex-col items-center gap-0.5 rounded-lg bg-secondary-bg-hover px-2 py-3">
			<span className="text-xl font-bold text-primary-fg">{value}</span>
			<span className="text-xs text-muted">{label}</span>
		</div>
	);
}

function MetricCircle({ label, value }: CircleMetric) {
	return (
		<div className="flex flex-col items-center gap-1.5">
			<div className="relative">
				<ProgressCircle size="sm" value={value ?? 0} />
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-sm font-semibold text-primary-fg">{value === null ? "—" : `${value}%`}</span>
				</div>
			</div>
			<span className="text-center text-xs leading-tight text-muted">{label}</span>
		</div>
	);
}

function MetricDetailCard({ metric }: { metric: MetricTab }) {
	return (
		<Card className="gap-4 p-4">
			<div className="flex items-baseline gap-2">
				<span className="text-2xl font-bold text-primary-fg">{formatValue(metric.total, metric.unit)}</span>
				<Delta value={metric.totalDelta} suffix={metric.unit === "%" ? "%" : ` ${metric.unit}`} />
			</div>

			{metric.isAdditive && (
				<div className="flex flex-col gap-1.5">
					<div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary-bg-hover">
						{metric.rows.map((row) => (
							<div
								key={row.brandId}
								className={getBrand(row.brandId).barClassName}
								style={{ width: `${(row.value / metric.total) * 100}%` }}
							/>
						))}
					</div>
					<div className="flex items-center justify-between text-xs text-muted">
						<span>соотношение брендов</span>
						<span>{formatValue(metric.total, metric.unit)}</span>
					</div>
				</div>
			)}

			<div className="flex flex-col divide-y divide-secondary-border">
				{metric.rows.map((row) => {
					const brand = getBrand(row.brandId);
					return (
						<div key={row.brandId} className="flex items-center gap-2 py-2.5 first:pt-0 last:pb-0">
							<span className={`h-2.5 w-2.5 shrink-0 rounded-[3px] ${brand.dotClassName}`} />
							<span className="text-sm text-primary-fg">{brand.name}</span>
							<Icon icon={ChevronRight} size="sm" className="text-muted" />
							<div className="ml-auto flex items-center gap-2">
								<span className="text-sm font-semibold text-primary-fg">{formatValue(row.value, metric.unit)}</span>
								<Delta value={row.delta} />
							</div>
						</div>
					);
				})}
			</div>

			{metric.id === "width" && (
				<p className="rounded-lg bg-secondary-bg-hover p-3 text-xs leading-relaxed text-muted">{linearShareHint}</p>
			)}
		</Card>
	);
}

export function VisitReport() {
	const [activeTab, setActiveTab] = useState<MetricTabId>("width");

	return (
		<div className="flex h-full w-full items-start justify-center overflow-auto bg-[#15181f] p-6">
			<div className="w-full max-w-[375px] shrink-0 overflow-hidden rounded-[2rem] bg-primary-bg shadow-hard-xl">
				<div className="flex flex-col gap-4 px-4 pb-8 pt-6">
					<div className="flex items-center gap-1">
						<Icon icon={ChevronLeft} size="md" className="text-primary-fg" />
						<h1 className="text-lg font-semibold text-primary-fg">Отчёт по визиту</h1>
					</div>

					<Card className="gap-4 p-4">
						<div className="grid grid-cols-3 gap-2">
							<StatTile value={visitSummary.brandsCount} label="бренда" />
							<StatTile value={visitSummary.skuCount} label="SKU" />
							<StatTile value={visitSummary.facingsCount} label="фейсов" />
						</div>

						<p className="text-xs text-muted">▲▼ — изменение к визиту {visitSummary.comparedVisitDate}</p>

						<div className="grid grid-cols-4 gap-1">
							{circleMetrics.map((metric) => (
								<MetricCircle key={metric.id} {...metric} />
							))}
						</div>
					</Card>

					<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as MetricTabId)}>
						<TabsList className="grid h-auto w-full grid-cols-4 gap-1">
							{metricTabs.map((tab) => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									className="h-auto whitespace-normal px-1.5 py-2 text-center text-xs leading-tight"
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>

						{metricTabs.map((tab) => (
							<TabsContent key={tab.id} value={tab.id} className="mt-3">
								<MetricDetailCard metric={tab} />
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>
		</div>
	);
}
