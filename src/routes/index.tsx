// src/routes/index.tsx

import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getAllComponents } from "../../data/components";

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

	return <pre>{JSON.stringify(state, null, 2)}</pre>;
}
