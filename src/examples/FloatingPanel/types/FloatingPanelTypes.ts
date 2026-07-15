import { LucideIcon } from "lucide-react";

export type Position = {
	x: number;
	y: number;
};

export type Viewport = {
	width: number;
	height: number;
};

export type PanelId = "history" | "notifications" | "comments";

export type PanelConfig = { id: PanelId; title: string; icon: LucideIcon };
