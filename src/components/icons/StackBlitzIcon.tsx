import { forwardRef } from "react";
import type { LucideProps } from "lucide-react";

export const StackBlitzIcon = forwardRef<SVGSVGElement, LucideProps>(
	(props, ref) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			ref={ref}
			{...props}
		>
			<path
				fill="currentColor"
				stroke="none"
				d="M10.797 14.182H3.635L16.56 0l-3.36 9.818H20.4L7.476 24z"
			/>
		</svg>
	)
);

StackBlitzIcon.displayName = "StackBlitzIcon";
