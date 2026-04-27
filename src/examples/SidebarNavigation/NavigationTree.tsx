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
import { SidebarGroup, SidebarGroupContent, SidebarInsertionLine, SidebarMenu } from "ics-ui-kit/components/sidebar";
import { NavigationTreeItem } from "./NavigationTreeItem";
import { NavigationSectionLabel } from "./NavigationSectionLabel";
import { useState } from "react";
import { ROOT_ID, initialExpanded, initialItems, initialSelected, type Item } from "./navigationData";

const INDENT = 16;

export function NavigationTree() {
	const [items, setItems] = useState(initialItems);

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
	const groups: {
		group: ItemInstance<Item>;
		children: ItemInstance<Item>[];
	}[] = [];
	for (const item of visible) {
		if (item.getItemMeta().level === 0) {
			groups.push({ group: item, children: [] });
		} else {
			groups.at(-1)?.children.push(item);
		}
	}

	return (
		<div {...tree.getContainerProps("Sidebar navigation")} className="relative flex flex-col gap-3">
			{groups.map(({ group, children }) => {
				const groupData = group.getItemData();
				return (
					<SidebarGroup key={group.getId()} className="py-0">
						<NavigationSectionLabel data={groupData} />
						<SidebarGroupContent>
							<SidebarMenu className="gap-0.5">
								{children.map((item) => (
									<NavigationTreeItem key={item.getId()} item={item} />
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				);
			})}
			<SidebarInsertionLine style={tree.getDragLineStyle()} />
		</div>
	);
}
