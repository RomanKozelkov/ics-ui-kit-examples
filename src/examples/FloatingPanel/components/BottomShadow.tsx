export const BottomShadow = () => {
	return (
		<div
			className="pointer-events-none absolute bottom-0 left-0 right-0"
			style={{
				height: 32,
				background: "linear-gradient(to bottom, transparent 0%, hsl(var(--secondary-bg) / 0.8) 100%)",
				zIndex: 10
			}}
		/>
	);
};
