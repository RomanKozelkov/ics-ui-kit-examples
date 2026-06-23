import * as React from "react";
import { cn } from "ics-ui-kit/lib/utils";

const FILTER_SUFFIX = "-liquid-glass";

function buildDisplacementMapSvg(width: number, height: number, borderRadius: number): string {
	const rx = Math.min(borderRadius, width / 2, height / 2);
	const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#000"/>
      <stop offset="100%" stop-color="red"/>
    </linearGradient>
    <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000"/>
      <stop offset="100%" stop-color="blue"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${width}" height="${height}" fill="black"/>
  <rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" fill="url(#red)"/>
  <rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" fill="url(#blue)" style="mix-blend-mode:difference"/>
  <rect x="1.89" y="1.89" width="${width - 3.78}" height="${height - 3.78}" rx="${rx}" fill="hsl(0 0% 50% / 0.93)" style="filter:blur(11px)"/>
</svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export interface LiquidGlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	blur?: number;
	saturate?: number;
	scale?: number;
	aberration?: number;
	borderRadius?: number;
}

export const LiquidGlassContainer = React.forwardRef<HTMLDivElement, LiquidGlassContainerProps>(
	(
		{
			className,
			children,
			blur = 7,
			saturate = 1.4,
			scale = 50,
			aberration = 0.06,
			borderRadius = 0,
			style,
			...props
		},
		ref
	) => {
		const containerRef = React.useRef<HTMLDivElement>(null);
		const feImageRef = React.useRef<SVGFEImageElement>(null);
		const filterId = React.useId().replace(/:/g, "").slice(0, 8) + FILTER_SUFFIX;

		React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

		React.useEffect(() => {
			const el = containerRef.current;
			const feImage = feImageRef.current;
			if (!el || !feImage) return;

			const update = () => {
				const { offsetWidth: w, offsetHeight: h } = el;
				if (w === 0 || h === 0) return;
				const href = buildDisplacementMapSvg(w, h, borderRadius);
				feImage.setAttribute("href", href);
				feImage.setAttribute("width", String(w));
				feImage.setAttribute("height", String(h));
			};

			update();
			const observer = new ResizeObserver(update);
			observer.observe(el);
			return () => observer.disconnect();
		}, [borderRadius]);

		const backdropFilter = `url(#${filterId}) blur(${blur}px) saturate(${saturate})`;

		return (
			<div
				ref={containerRef}
				className={cn("relative", className)}
				style={{
					backdropFilter,
					WebkitBackdropFilter: backdropFilter,
					borderRadius,
					...style
				}}
				{...props}
			>
				<svg aria-hidden focusable={false} width={0} height={0} style={{ position: "absolute" }}>
					<defs>
						<filter id={filterId} colorInterpolationFilters="sRGB">
							<feImage ref={feImageRef} x="0" y="0" preserveAspectRatio="none" result="map" />
							<feDisplacementMap
								in="SourceGraphic"
								in2="map"
								xChannelSelector="R"
								yChannelSelector="B"
								scale={String(-scale)}
								result="dispRed"
							/>
							<feColorMatrix
								in="dispRed"
								type="matrix"
								values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
								result="red"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="map"
								xChannelSelector="R"
								yChannelSelector="B"
								scale={String(-(scale * (1 - aberration)))}
								result="dispGreen"
							/>
							<feColorMatrix
								in="dispGreen"
								type="matrix"
								values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0"
								result="green"
							/>
							<feDisplacementMap
								in="SourceGraphic"
								in2="map"
								xChannelSelector="R"
								yChannelSelector="B"
								scale={String(-(scale * (1 - aberration * 2)))}
								result="dispBlue"
							/>
							<feColorMatrix
								in="dispBlue"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0"
								result="blue"
							/>
							<feBlend in="red" in2="green" mode="screen" result="rg" />
							<feBlend in="rg" in2="blue" mode="screen" result="output" />
							<feGaussianBlur in="output" stdDeviation="0.7" />
						</filter>
					</defs>
				</svg>
				{children}
			</div>
		);
	}
);

LiquidGlassContainer.displayName = "LiquidGlassContainer";
