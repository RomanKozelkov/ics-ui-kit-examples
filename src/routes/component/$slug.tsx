import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageComponentCanvas } from "../../components/PageComponentCanvas/PageComponentCanvas";
import { components } from "virtual:components";

export const Route = createFileRoute("/component/$slug")({
	component: ComponentPage,
	loader: ({ params }) => {
		const component = components.find((c) => c.slug === params.slug);
		if (!component) throw notFound();
		return component;
	}
});

function ComponentPage() {
	const component = Route.useLoaderData();

	return (
		<div className="h-screen w-screen overflow-auto">
			<PageComponentCanvas {...component} />
		</div>
	);
}
