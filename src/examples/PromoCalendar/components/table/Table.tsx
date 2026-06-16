import * as React from "react";
import { cn } from "ics-ui-kit/lib/utils";

const Wrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div className="relative w-full overflow-x-auto">
			<div ref={ref} className={cn("w-full text-sm", className)} {...props} />
		</div>
	)
);

Wrapper.displayName = "PromoTable.Wrapper";

const Header = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("border-b", className)} {...props} />
	)
);

Header.displayName = "PromoTable.Header";

const Body = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("[&>*:last-child]:border-0", className)} {...props} />
	)
);

Body.displayName = "PromoTable.Body";

const Row = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex border-b transition-colors hover:bg-alpha-high-97 data-[state=selected]:bg-alpha-high-95 data-[state=selected]:hover:bg-alpha-high-92",
				className
			)}
			{...props}
		/>
	)
);

Row.displayName = "PromoTable.Row";

const Head = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("h-10 px-2 text-left font-medium text-muted-foreground flex items-center", className)}
			{...props}
		/>
	)
);

Head.displayName = "PromoTable.Head";

const Cell = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("p-2 flex items-center", className)} {...props} />
	)
);

Cell.displayName = "PromoTable.Cell";

export const PromoTable = {
	Wrapper,
	Header,
	Body,
	Row,
	Head,
	Cell
};
