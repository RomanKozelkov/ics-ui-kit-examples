interface FilterFieldProps {
	label: React.ReactNode;
	children: React.ReactNode;
}

export function FilterField({ label, children }: FilterFieldProps) {
	return (
		<label className="flex flex-col gap-2 space-y-0">
			<span className="text-sm font-medium leading-none text-primary-fg">{label}</span>
			{children}
		</label>
	);
}
