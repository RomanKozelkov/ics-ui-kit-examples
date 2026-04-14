// src/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
	Outlet,
	createRootRoute,
	HeadContent,
	Scripts
} from "@tanstack/react-router";
import { TooltipProvider } from "ics-ui-kit/components/tooltip";
import "../index.css";
import "ics-ui-kit/theme.css";

// import "ics-ui-kit/font-inter.css";

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
				title: "TanStack Start Starter"
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
