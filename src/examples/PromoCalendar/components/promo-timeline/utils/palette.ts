export type PromoColor = "info" | "success" | "warning" | "error";

const STATUSES: PromoColor[] = ["info", "success", "warning", "error"];

/** Цвет привязан к стабильному id промо, а не к позиции в массиве:
 *  не прыгает при фильтре/reorder/override. */
export function colorForId(id: number): PromoColor {
	const hash = Math.abs(Math.trunc(id));
	return STATUSES[hash % STATUSES.length];
}
