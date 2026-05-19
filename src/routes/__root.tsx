// src/routes/__root.tsx
/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TooltipProvider } from "ics-ui-kit/components/tooltip";
import "ics-ui-kit/theme.css";
import type { ReactNode } from "react";
import "../index.css";
import "@fontsource-variable/inter";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				title: "UI Kit Examples"
			}
		]
	}),
	component: RootComponent
});

function RootComponent() {
	return (
		<RootDocument>
			<TooltipProvider>
				<Outlet />
			</TooltipProvider>
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}
