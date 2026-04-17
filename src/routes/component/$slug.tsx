import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageComponentCanvas } from "../../components/PageComponentCanvas/PageComponentCanvas";
import { components } from "virtual:components";

type ComponentSearch = {
	embed?: boolean;
	theme?: "light" | "dark";
};

export const Route = createFileRoute("/component/$slug")({
	component: ComponentPage,
	validateSearch: (search: Record<string, unknown>): ComponentSearch => ({
		embed: search.embed === true || search.embed === 1 || search.embed === "1" || search.embed === "true",
		theme: search.theme === "dark" ? "dark" : search.theme === "light" ? "light" : undefined
	}),
	loader: ({ params }) => {
		const component = components.find((c) => c.slug === params.slug);
		if (!component) throw notFound();
		return component;
	}
});

function ComponentPage() {
	const component = Route.useLoaderData();
	const { embed, theme } = Route.useSearch();

	if (embed) {
		return <PageComponentCanvas {...component} embed forcedTheme={theme} />;
	}

	return (
		<div className="h-full w-full overflow-auto">
			<PageComponentCanvas {...component} />
		</div>
	);
}
