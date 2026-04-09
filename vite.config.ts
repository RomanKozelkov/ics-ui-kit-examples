import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { componentsPlugin } from "./src/plugins/vite-plugin-components";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
	base: isGitHubPages ? "/ics-ui-kit-examples/" : "/",
	server: {
		port: 3000
	},
	resolve: {
		tsconfigPaths: true
	},
	plugins: [
		componentsPlugin(),
		tanstackStart({
			prerender: {
				enabled: isGitHubPages,
				crawlLinks: true
			}
		}),
		// react's vite plugin must come after start's vite plugin
		viteReact()
	]
});
