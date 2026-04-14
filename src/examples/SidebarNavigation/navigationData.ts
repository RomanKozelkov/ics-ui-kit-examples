export interface Item {
	name: string;
	badge?: number;
	children?: string[];
}

export const ROOT_ID = "__root";

export const initialItems: Record<string, Item> = {
	[ROOT_ID]: {
		name: "Root",
		children: ["command-palette", "group-title-2", "good-design"]
	},

	"command-palette": {
		name: "Command Palette",
		children: ["great-design"]
	},
	"great-design": {
		name: "Great design is invisible",
		children: ["invisible-means", "clarity", "examples"]
	},
	"invisible-means": {
		name: '"Invisible" Means',
		children: ["without-friction", "ui-disappears"]
	},
	"without-friction": { name: "Design without friction" },
	"ui-disappears": { name: "When UI disappears" },
	clarity: { name: "Clarity over Decoration" },
	examples: { name: "Examples in Practice" },

	"group-title-2": {
		name: "Group title 2",
		children: ["excellent-design"]
	},
	"excellent-design": {
		name: "Excellent design",
		badge: 5,
		children: ["foundations", "craft", "design-at-scale"]
	},
	foundations: { name: "Foundations of Excellence" },
	craft: { name: "Craft & Detail" },
	"design-at-scale": {
		name: "Design at Scale",
		children: ["design-systems", "maintaining"]
	},
	"design-systems": {
		name: "Design Systems",
		children: ["ics-it"]
	},
	"ics-it": { name: "ICS-IT Design System" },
	maintaining: { name: "Maintaining quality over time" },

	"good-design": {
		name: "Good design",
		children: ["what-makes-good", "common-patterns", "limits"]
	},
	"what-makes-good": { name: 'What Makes Design "Good"', badge: 157 },
	"common-patterns": { name: "Common Patterns" },
	limits: { name: "Limits of Good Design" }
};

export const initialExpanded = [
	"command-palette",
	"great-design",
	"invisible-means",
	"group-title-2",
	"excellent-design",
	"design-at-scale",
	"design-systems",
	"good-design"
];

export const initialSelected = ["invisible-means"];
