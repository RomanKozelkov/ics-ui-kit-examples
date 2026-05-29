import { SIDEBAR_MENU_SUB_INDENT } from "./constants";

// Каждый SidebarMenuSub добавляет ml-3.5 (14px) + pl-2.5 (10px) = 24px на уровень вложенности
export function getIndicatorOffset(level: number): string {
	return `${-(level - 1) * SIDEBAR_MENU_SUB_INDENT}px`;
}
