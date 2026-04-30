interface NavigationItemCounterProps {
	children: React.ReactNode;
}

export function NavigationItemCounter({ children }: NavigationItemCounterProps) {
	return (
		<div className="min-w-4 rounded-full rounded-bl-none bg-status-warning-hover px-1 py-[3px] text-center text-[10px] leading-none text-secondary-bg">
			{children}
		</div>
	);
}
