// src/routes/index.tsx

import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ComponentCanvas } from "../components/ComponentCanvas/ComponentCanvas";
import { getAllComponents } from "../data/components";
import { ToolCase } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";

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
		<div className="p-4 container mx-auto">
			<h2 className="text-2xl font-bold pb-4 flex items-center">
				<Icon icon={ToolCase} size="lg" className="mr-2" /> UI Kit
				Examples
			</h2>
			<div className="flex flex-col gap-4">
				{state.map((component) => (
					<div key={component.slug}>
						<ComponentCanvas {...component} />
					</div>
				))}
			</div>
		</div>
	);
}
