/*
 * useLiquidGlass — хук-рецепт для liquid glass эффекта.
 * Альтернатива GlassComponent (components/GlassComponent.tsx) — используйте когда нужна
 * полная свобода: любой HTML-элемент, своя разметка, кастомные стили.
 * Копируйте в проект и настраивайте под себя.
 */
import * as React from "react";

function buildDisplacementMapSvg(width: number, height: number, _aberration: number): string {
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
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#red)"/>
  <rect x="0" y="0" width="${width}" height="${height}" fill="url(#blue)" style="mix-blend-mode:difference"/>
  <rect x="1.89" y="1.89" width="${width - 3.78}" height="${height - 3.78}" fill="hsl(0 0% 50% / 0.93)" style="filter:blur(11px)"/>
</svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export interface UseLiquidGlassOptions {
	blur?: number;
	saturate?: number;
	scale?: number;
	aberration?: number;
}

export interface UseLiquidGlassReturn {
	ref: React.RefObject<HTMLDivElement | null>;
	style: React.CSSProperties;
	svgElement: React.ReactElement;
}

export function useLiquidGlass({
	blur = 7,
	saturate = 1.4,
	scale = 50,
	aberration = 0.06
}: UseLiquidGlassOptions = {}): UseLiquidGlassReturn {
	const ref = React.useRef<HTMLDivElement>(null);
	const feImageRef = React.useRef<SVGFEImageElement>(null);
	const filterId = React.useId().replace(/:/g, "").slice(0, 8) + "-liquid-glass";

	React.useEffect(() => {
		const el = ref.current;
		const feImage = feImageRef.current;
		if (!el || !feImage) return;

		const update = () => {
			const { offsetWidth: w, offsetHeight: h } = el;
			if (w === 0 || h === 0) return;
			const href = buildDisplacementMapSvg(w, h, aberration);
			feImage.setAttribute("href", href);
			feImage.setAttribute("width", String(w));
			feImage.setAttribute("height", String(h));
		};

		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, [aberration]);

	const style: React.CSSProperties = {
		backdropFilter: `url(#${filterId}) blur(${blur}px) saturate(${saturate})`,
		WebkitBackdropFilter: `url(#${filterId}) blur(${blur}px) saturate(${saturate})`
	};

	const svgElement = (
		<svg aria-hidden focusable={false} width={0} height={0} style={{ position: "absolute" }}>
			<defs>
				<filter id={filterId} colorInterpolationFilters="sRGB">
					<feImage ref={feImageRef} x="0" y="0" preserveAspectRatio="none" result="map" />
					<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={String(-scale)} result="dispRed" />
					<feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
					<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={String(-(scale * (1 - aberration)))} result="dispGreen" />
					<feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
					<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="B" scale={String(-(scale * (1 - aberration * 2)))} result="dispBlue" />
					<feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
					<feBlend in="red" in2="green" mode="screen" result="rg" />
					<feBlend in="rg" in2="blue" mode="screen" result="output" />
					<feGaussianBlur in="output" stdDeviation="0.7" />
				</filter>
			</defs>
		</svg>
	);

	return { ref, style, svgElement };
}
