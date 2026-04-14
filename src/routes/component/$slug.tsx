import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageComponentCanvas } from "../../components/PageComponentCanvas/PageComponentCanvas";
import { components } from "virtual:components";

type ComponentSearch = {
	embed?: boolean;
};

export const Route = createFileRoute("/component/$slug")({
	component: ComponentPage,
	validateSearch: (search: Record<string, unknown>): ComponentSearch => ({
		embed:
			search.embed === true ||
			search.embed === 1 ||
			search.embed === "1" ||
			search.embed === "true"
	}),
	loader: ({ params }) => {
		const component = components.find((c) => c.slug === params.slug);
		if (!component) throw notFound();
		return component;
	}
});

function ComponentPage() {
	const component = Route.useLoaderData();
	const { embed } = Route.useSearch();

	if (embed) {
		return <PageComponentCanvas {...component} embed />;
	}

	return (
		<div className="h-screen w-screen overflow-auto">
			<PageComponentCanvas {...component} />
		</div>
	);
}
