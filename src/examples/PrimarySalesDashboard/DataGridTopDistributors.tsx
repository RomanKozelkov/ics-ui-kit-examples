import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell
} from "ics-ui-kit/components/table";
import { Icon } from "ics-ui-kit/components/icon";
import { Building2, TrendingDown, TrendingUp } from "lucide-react";

type Row = {
	name: string;
	sales: number;
	yoy: number;
	share: number;
	rank: number | null;
};

const ROWS: Row[] = [
	{ name: "Пульс ФК ООО", sales: 617298, yoy: -14, share: 61, rank: 0 },
	{ name: "Гранд Капитал ООО", sales: 161208, yoy: -18, share: 16, rank: 0 },
	{ name: "Фармкомплект ООО", sales: 102156, yoy: 28, share: 10, rank: 2 },
	{ name: "БСС ООО", sales: 81924, yoy: -6, share: 8, rank: 0 },
	{ name: "Вита Лайн ООО", sales: 56818, yoy: -51, share: 6, rank: -2 }
];

const nf = new Intl.NumberFormat("ru-RU");

function YoyCell({ value }: { value: number }) {
	const positive = value >= 0;
	return (
		<span
			className={
				"inline-flex items-center gap-0.5 font-medium " +
				(positive ? "text-status-success-fg" : "text-status-error-fg")
			}
		>
			{positive ? "+" : ""}
			{value}%
		</span>
	);
}

function RankCell({ value }: { value: number | null }) {
	if (value === null || value === 0) return <span className="text-tertiary-fg">—</span>;
	const positive = value > 0;
	return (
		<span
			className={
				"inline-flex items-center gap-0.5 font-medium " +
				(positive ? "text-status-success-fg" : "text-status-error-fg")
			}
		>
			<Icon icon={positive ? TrendingUp : TrendingDown} size="xs" />
			{positive ? "+" : ""}
			{value}
		</span>
	);
}

export function DataGridTopDistributors() {
	return (
		<div className="rounded-xl border border-secondary-border bg-secondary-bg p-4">
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Icon icon={Building2} size="sm" />
					<h2 className="text-base font-medium text-primary-fg">Топ Дистрибьюторы</h2>
				</div>
				<a href="#" className="text-xs text-accent-fg hover:underline">
					Подробнее ›
				</a>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[40px]">№</TableHead>
						<TableHead>Дистрибьютор</TableHead>
						<TableHead className="text-right">Sales</TableHead>
						<TableHead className="text-right">YOY%</TableHead>
						<TableHead className="text-right">Share</TableHead>
						<TableHead className="text-right">Rank</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{ROWS.map((row, i) => (
						<TableRow key={row.name}>
							<TableCell className="text-secondary-fg">{i + 1}</TableCell>
							<TableCell className="font-medium">{row.name}</TableCell>
							<TableCell className="text-right tabular-nums">{nf.format(row.sales)}</TableCell>
							<TableCell className="text-right tabular-nums">
								<YoyCell value={row.yoy} />
							</TableCell>
							<TableCell className="text-right tabular-nums">{row.share}%</TableCell>
							<TableCell className="text-right tabular-nums">
								<RankCell value={row.rank} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
