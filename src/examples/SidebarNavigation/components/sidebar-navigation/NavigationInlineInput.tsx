import { useEffect, useRef } from "react";
import { INDENT_SIDEBAR_ITEM_WIDTH } from "../../utils/constants";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";

export function NavigationInlineInput({ id, level }: { id: string; level: number }) {
	const commitRename = useNavigationTreeStore((s) => s.commitRename);
	const cancelRename = useNavigationTreeStore((s) => s.cancelRename);
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		ref.current?.focus();
	}, []);

	const handleSubmit = (value: string) => {
		const name = value.trim();
		if (name) commitRename(id, name);
		else cancelRename();
	};

	return (
		<input
			ref={ref}
			className="absolute inset-0 w-auto rounded-md bg-background px-2 text-sm font-medium outline-none ring-1 ring-inset ring-muted"
			style={{ marginLeft: (level - 1) * INDENT_SIDEBAR_ITEM_WIDTH }}
			onBlur={(e) => handleSubmit(e.currentTarget.value)}
			onKeyDown={(e) => {
				if (e.key === "Enter") handleSubmit(e.currentTarget.value);
				if (e.key === "Escape") cancelRename();
			}}
		/>
	);
}
