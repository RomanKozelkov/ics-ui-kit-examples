import {
	createOnDropHandler,
	dragAndDropFeature,
	hotkeysCoreFeature,
	keyboardDragAndDropFeature,
	selectionFeature,
	syncDataLoaderFeature,
	type ItemInstance
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "ics-ui-kit/components/sidebar";
import { NavigationTreeItem } from "./NavigationTreeItem";
import { NavigationSectionLabel } from "./NavigationSectionLabel";
import { useRef, useState } from "react";
import { ROOT_ID, initialExpanded, initialItems, initialSelected, type Item } from "./navigationData";

const INDENT = 16;

export function NavigationTree() {
	const [items, setItems] = useState(initialItems);
	const dragPreviewRef = useRef<HTMLDivElement | null>(null);

	const tree = useTree<Item>({
		rootItemId: ROOT_ID,
		canReorder: true,
		indent: INDENT,
		initialState: {
			expandedItems: initialExpanded,
			selectedItems: initialSelected
		},
		dataLoader: {
			getItem: (id) => items[id],
			getChildren: (id) => items[id]?.children ?? []
		},
		features: [
			syncDataLoaderFeature,
			selectionFeature,
			hotkeysCoreFeature,
			dragAndDropFeature,
			keyboardDragAndDropFeature
		],
		getItemName: (item) => item.getItemData().name,
		isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
		canDrag: (dragged) => dragged.every((i) => i.getItemMeta().level > 0),
		setDragImage: (draggedItems) => {
			const el = dragPreviewRef.current!;
			el.textContent = draggedItems.map((i) => i.getItemName()).join(", ");
			return { imgElement: el, xOffset: 80, yOffset: 14 };
		},
		onDrop: createOnDropHandler<Item>((parent, newChildren) => {
			setItems((prev) => ({
				...prev,
				[parent.getId()]: {
					...prev[parent.getId()],
					children: newChildren
				}
			}));
		})
	});

	const visible = tree.getItems();
	const groups: { group: ItemInstance<Item> }[] = [];
	for (const item of visible) {
		if (item.getItemMeta().level === 0) {
			groups.push({ group: item });
		}
	}

	return (
		<div {...tree.getContainerProps("Sidebar navigation")} className="relative mt-4 flex flex-col gap-3">
			{groups.map(({ group }) => {
				const groupData = group.getItemData();
				return (
					<SidebarGroup key={group.getId()} className="py-0 pr-4">
						<NavigationSectionLabel data={groupData} />
						<SidebarGroupContent>
							<SidebarMenu className="gap-0.5 pb-0.5">
								{group.getChildren().map((item) => (
									<NavigationTreeItem key={item.getId()} item={item} />
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				);
			})}

			<div
				ref={dragPreviewRef}
				className="fixed left-0 top-0 z-[9999] h-7 w-auto min-w-40 rounded-md bg-secondary-bg p-1.5 pl-2 text-sm leading-none text-primary-fg opacity-85 shadow-soft-md"
				style={{ transform: "translate(-100vw, -100vh)" }}
			/>
		</div>
	);
}
