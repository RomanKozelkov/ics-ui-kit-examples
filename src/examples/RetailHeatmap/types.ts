export type PointType = "pharmacy" | "store" | "kiosk" | "warehouse" | "hyper" | "distrib";
export type Category = "A" | "B" | "C" | "D";

/** Торговая точка на карте. Модель повторяет референс-прототип OPL-145. */
export interface TradePoint {
	/** Код торговой точки */
	code: string;
	lat: number;
	lng: number;
	type: PointType;
	/** ABC(D)-категория */
	cat: Category;
	/** Ответственный менеджер; null → «Не назначен» / «Unknown» */
	manager: string | null;
	/** Оборот, ₽/мес */
	turnover: number;
	/** Население (охват), чел. */
	pop: number;
	/** Район-кластер генерации */
	district: string;
}

export interface TypeMeta {
	key: PointType;
	label: string;
	color: string;
	/** Внутренние пути SVG-иконки (24×24) */
	icon: string;
}

export const TYPES: TypeMeta[] = [
	{ key: "pharmacy", label: "Аптека", color: "#1f9d57", icon: '<line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/>' },
	{ key: "store", label: "Магазин", color: "#2563eb", icon: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>' },
	{ key: "kiosk", label: "Киоск", color: "#db2777", icon: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20"/>' },
	{ key: "warehouse", label: "Склад", color: "#d97706", icon: '<path d="M12 3 3 8v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v7"/>' },
	{ key: "hyper", label: "Гипермаркет", color: "#7c3aed", icon: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h2l2.6 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 1.95-1.57L23 6H5"/>' },
	{ key: "distrib", label: "Дистрибьютор", color: "#0891b2", icon: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>' }
];

export const TYPE_MAP: Record<PointType, TypeMeta> = Object.fromEntries(
	TYPES.map((t) => [t.key, t])
) as Record<PointType, TypeMeta>;

export const CAT_COLORS: Record<Category, string> = {
	A: "#1f9d57",
	B: "#2563eb",
	C: "#d97706",
	D: "#64748b"
};
