// src/routes/index.tsx

import { createFileRoute } from "@tanstack/react-router";
import { ComponentCanvas } from "../components/ComponentCanvas/ComponentCanvas";
import { components } from "virtual:components";
import { ToolCase } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";

export const Route = createFileRoute("/")({
	component: Home,
	loader: () => components
});

function Home() {
	// const router = useRouter();
	const state = Route.useLoaderData();

	return (
		<div className="h-full w-full overflow-auto bg-primary-bg">
			<div className="container mx-auto p-4">
				<h2 className="flex items-center pb-4 text-2xl font-bold">
					<Icon icon={ToolCase} size="lg" className="mr-2" /> UI Kit Examples
				</h2>
				<div className="flex flex-col gap-4">
					{state.map((component) => (
						<div key={component.slug}>
							<ComponentCanvas {...component} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
