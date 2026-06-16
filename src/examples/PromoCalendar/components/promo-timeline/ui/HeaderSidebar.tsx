import { useText } from "../../../i18n";

type Props = {
	width: number;
};

/** Sticky top-left corner cell that labels the grouping column. */
export function HeaderSidebar({ width }: Props) {
	const text = useText();

	if (width <= 0) return null;

	return (
		<div className="sticky left-0 z-[5] shrink-0 bg-primary-bg" style={{ width }}>
			<div className="flex h-full items-center px-2 text-xs font-medium text-muted-foreground">{text("calendar.group")}</div>
		</div>
	);
}
