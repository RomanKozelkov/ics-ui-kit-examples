import { useState } from "react";
import { UiComponent } from "../../data/types";
import { ComponentCode } from "../ComponentCode/ComponentCode";
import { ComponentHeader } from "../ComponentHeader/ComponentHeader";

const DEFAULT_PREVIEW_HEIGHT = 640;

export function ComponentCanvas(props: UiComponent) {
	const [tab, setTab] = useState<"preview" | "code">("preview");
	const height = props.attributes.canvas?.height ?? DEFAULT_PREVIEW_HEIGHT;

	return (
		<div className="flex flex-col gap-4 my-4" id={props.slug}>
			<ComponentHeader
				title={props.attributes.title}
				slug={props.slug}
				component={props.component}
				activeTab={tab}
				onTabChange={setTab}
			/>
			{tab === "preview" ? (
				<iframe
					src={`${import.meta.env.BASE_URL}component/${props.slug}?embed=1`}
					title={props.attributes.title}
					className="w-full block border border-secondary-border bg-secondary-bg"
					style={{ height }}
				/>
			) : (
				<ComponentCode files={props.code} />
			)}
		</div>
	);
}
