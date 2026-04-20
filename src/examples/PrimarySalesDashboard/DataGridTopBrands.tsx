import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "ics-ui-kit/components/table";
import { Icon } from "ics-ui-kit/components/icon";
import { Pill, TrendingDown, TrendingUp } from "lucide-react";

type Row = {
	name: string;
	sales: number;
	yoy: number;
	share: number;
	rank: number | null;
};

const ROWS: Row[] = [
	{ name: "Zolphirex Night", sales: 5429860, yoy: -27, share: 31, rank: 0 },
	{ name: "Osteoglyph", sales: 2957112, yoy: -7, share: 17, rank: 0 },
	{ name: "Thyquolam", sales: 2158919, yoy: -14, share: 12, rank: 0 },
	{ name: "Rhevixol Joint", sales: 1714068, yoy: -11, share: 10, rank: 0 },
	{ name: "Ferruvoxin Hema", sales: 1341120, yoy: 4, share: 8, rank: 0 },
	{ name: "Panzyqor Enzyme", sales: 1039120, yoy: 6, share: 6, rank: 1 },
	{ name: "Yttrivax", sales: 980208, yoy: -21, share: 6, rank: -1 },
	{ name: "Dwimoxan", sales: 696684, yoy: -10, share: 4, rank: 0 }
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

export function DataGridTopBrands() {
	return (
		<div className="rounded-xl border border-secondary-border bg-secondary-bg p-4">
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Icon icon={Pill} size="sm" />
					<h2 className="text-base font-medium text-primary-fg">Топ Бренды</h2>
				</div>
				<a href="#" className="text-accent-fg text-xs hover:underline">
					Подробнее ›
				</a>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[40px]">№</TableHead>
						<TableHead>Бренд</TableHead>
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
