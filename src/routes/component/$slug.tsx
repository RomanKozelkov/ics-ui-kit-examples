import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PageComponentCanvas } from "../../components/PageComponentCanvas/PageComponentCanvas";
import { getComponentBySlug } from "../../data/components";

const getComponent = createServerFn({ method: "GET" }).handler(
	({ data: slug }) => {
		const component = getComponentBySlug(slug);
		if (!component) throw notFound();
		return component;
	}
);

export const Route = createFileRoute("/component/$slug")({
	component: ComponentPage,
	loader: ({ params }) => getComponent({ data: params.slug })
});

function ComponentPage() {
	const component = Route.useLoaderData();

	return (
		<div className="h-screen w-screen overflow-auto">
			<PageComponentCanvas {...component} />
		</div>
	);
}
