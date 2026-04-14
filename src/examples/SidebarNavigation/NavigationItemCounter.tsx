interface NavigationItemCounterProps {
	children: React.ReactNode;
}

export function NavigationItemCounter({
	children
}: NavigationItemCounterProps) {
	return (
		<div className="bg-status-warning-hover rounded-full rounded-bl-none py-1 px-1.5 text-[10px] leading-none text-secondary-bg">
			{children}
		</div>
	);
}
