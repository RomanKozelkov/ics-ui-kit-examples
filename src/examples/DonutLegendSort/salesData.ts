/** Канал продаж: лист внешнего кольца. */
export type ChannelRow = { name: string; value: number };

/** Группа каналов: сегмент внутреннего кольца, объединяет каналы внешнего. */
export type ChannelGroup = { name: string; children: ChannelRow[] };

/**
 * Данные продаж по каналам, сгруппированные для двухуровневой лучевой диаграммы.
 * Внутреннее кольцо — группы, внешнее — отдельные каналы.
 */
export const SALES_BY_CHANNEL: ChannelGroup[] = [
	{
		name: "Perfum",
		children: [{ name: "Perfum", value: 4_043_001_234 }]
	},
	{
		name: "Pharma",
		children: [
			{ name: "Pharma", value: 1_344_733_180 },
			{ name: "Distri", value: 1_125_007_042 },
			{ name: "E-Phar", value: 834_966_164 }
		]
	},
	{
		name: "E-Com",
		children: [
			{ name: "MarketP", value: 1_098_639_689 },
			{ name: "E-Perfum", value: 123_047_645 },
			{ name: "E-Retail", value: 121_047_645 },
			{ name: "D2C", value: 96_680_293 }
		]
	},
	{
		name: "Other",
		children: [
			{ name: "Clinic", value: 1_200_000 },
			{ name: "Other", value: 794_621 }
		]
	}
];
