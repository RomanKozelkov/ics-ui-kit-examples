import { useEffect, useRef } from "react";
import { useNavigationTreeStore } from "./navigationTreeStore";

export function NavigationInlineInput({ id }: { id: string }) {
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
			className="absolute inset-0 w-full rounded-sm bg-background px-2 text-sm outline-none ring-1 ring-inset ring-primary-fg"
			onBlur={(e) => handleSubmit(e.currentTarget.value)}
			onKeyDown={(e) => {
				if (e.key === "Enter") handleSubmit(e.currentTarget.value);
				if (e.key === "Escape") cancelRename();
			}}
		/>
	);
}
