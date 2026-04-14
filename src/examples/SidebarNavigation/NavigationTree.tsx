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
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarInsertionLine,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem
} from "ics-ui-kit/components/sidebar";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import {
	ROOT_ID,
	initialExpanded,
	initialItems,
	initialSelected,
	type Item
} from "./navigationData";

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
		isItemFolder: (item) =>
			(item.getItemData()?.children?.length ?? 0) > 0,
		canDrag: (dragged) =>
			dragged.every((i) => i.getItemMeta().level > 0),
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
		<div
			{...tree.getContainerProps("Sidebar navigation")}
			className="relative flex flex-col"
		>
			{groups.map(({ group, children }) => {
				const groupData = group.getItemData();
				return (
					<SidebarGroup key={group.getId()}>
						<SidebarGroupLabel>
							<span className="flex-1">{groupData.name}</span>
							{groupData.badge != null && (
								<span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 font-medium text-white text-xs">
									{groupData.badge}
								</span>
							)}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{children.map((item) => {
									const data = item.getItemData();
									const depth =
										item.getItemMeta().level - 1;
									return (
										<SidebarMenuItem key={item.getId()}>
											<SidebarMenuButton
												{...item.getProps()}
												isActive={item.isSelected()}
												tooltip={data.name}
												className="group/nav"
												style={{
													paddingInlineStart:
														8 + depth * INDENT
												}}
											>
												{item.isFolder() ? (
													<ChevronRight
														className={
															"size-4 shrink-0 text-muted-foreground transition-transform " +
															(item.isExpanded()
																? "rotate-90"
																: "")
														}
													/>
												) : (
													<span className="size-4 shrink-0" />
												)}
												<span className="truncate">
													{data.name}
												</span>
												{data.badge != null && (
													<SidebarMenuBadge>
														{data.badge}
													</SidebarMenuBadge>
												)}
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				);
			})}
			<SidebarInsertionLine style={tree.getDragLineStyle()} />
		</div>
	);
}
