import { useState } from "react";
import { UiComponent } from "../../data/types";
import * as UiComponents from "../../examples";
import { ComponentCode } from "../ComponentCode/ComponentCode";
import { ComponentHeader } from "../ComponentHeader/ComponentHeader";
import { ComponentPreview } from "../ComponentPreview/ComponentPreview";

export function ComponentCanvas(props: UiComponent) {
	const [tab, setTab] = useState<"preview" | "code">("preview");
	const Component = UiComponents[props.component];

	return (
		<div>
			<ComponentHeader
				title={props.attributes.title}
				activeTab={tab}
				onTabChange={setTab}
			/>
			{tab === "preview" ? (
				<ComponentPreview classNames={props.attributes.canvas.classNames}>
					<Component {...props.attributes.props} />
				</ComponentPreview>
			) : (
				<ComponentCode files={props.code} />
			)}
		</div>
	);
}

