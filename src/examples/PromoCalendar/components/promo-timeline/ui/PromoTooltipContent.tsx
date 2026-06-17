import type { PreparedPromoItem } from "../types";
import { isoToDdMmYyyy } from "../utils/date";
import { useText } from "../../../i18n";

export function PromoTooltipContent({ item }: { item: PreparedPromoItem }) {
	const text = useText();

	return (
		<dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs">
			<dt className="text-muted-foreground">{text("promo.name")}</dt>
			<dd>{item.title}</dd>
			<dt className="text-muted-foreground">{text("promo.period")}</dt>
			<dd>
				{isoToDdMmYyyy(item.dateBegin)} – {isoToDdMmYyyy(item.dateEnd)}
			</dd>
			<dt className="text-muted-foreground">{text("promo.channel")}</dt>
			<dd>{item.channelType}</dd>
		</dl>
	);
}
