// src/routes/index.tsx

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getAllComponents } from "../data/components";
import { Toggle } from "ics-ui-kit/components/toggle";
import { Icon } from "ics-ui-kit/components/icon";
import { Star } from "lucide-react";
import { ComponentCanvas } from "../components/ComponentCanvas/ComponentCanvas";

const getComponents = createServerFn({
	method: "GET"
}).handler(() => {
	return getAllComponents();
});

export const Route = createFileRoute("/")({
	component: Home,
	loader: async () => await getComponents()
});

function Home() {
	// const router = useRouter();
	const state = Route.useLoaderData();

	return (
		<div className="p-4">
			{state.map((component) => (
				<ComponentCanvas key={component.slug} {...component} />
			))}
			<Toggle size="md" variant="outline">
				<Icon icon={Star} />
			</Toggle>
		</div>
	);
}
