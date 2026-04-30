import { ItemInstance } from "@headless-tree/core";

export function getItemProps<T>(item: ItemInstance<T>, itemProps: ReturnType<ItemInstance<T>["getProps"]>) {
	const { onClick, ...rest } = itemProps;
	return {
		...rest,
		onClick: (e: React.MouseEvent<HTMLElement>) => {
			if (!onClick) return;
			const expand = item.expand;
			const collapse = item.collapse;
			item.expand = () => void 0;
			item.collapse = () => void 0;
			try {
				onClick(e.nativeEvent);
			} finally {
				item.expand = expand;
				item.collapse = collapse;
			}
		}
	};
}
