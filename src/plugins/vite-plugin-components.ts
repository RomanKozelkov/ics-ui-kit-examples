import type { Plugin } from "vite";
import { getAllComponents } from "../data/components";

const VIRTUAL_MODULE_ID = "virtual:components";
const RESOLVED_ID = `\0${VIRTUAL_MODULE_ID}`;

export function componentsPlugin(): Plugin {
	return {
		name: "vite-plugin-components",
		resolveId(id) {
			if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
		},
		load(id) {
			if (id === RESOLVED_ID) {
				const components = getAllComponents();
				return `export const components = ${JSON.stringify(components)};`;
			}
		}
	};
}
