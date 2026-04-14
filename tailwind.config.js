import preset from "ics-ui-kit/tailwind.preset";

/** @type {import('tailwindcss').Config} */
export default {
	presets: [preset],
	content: [
		"./index.html",
		"./src/**/*.{ts,tsx,js,jsx}",
		// Required: scan kit component classes so they're included in the build
		"./node_modules/ics-ui-kit/dist/**/*.js"
	]
};
