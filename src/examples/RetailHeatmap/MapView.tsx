import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { TRADE_POINTS } from "./mockData";
import { TYPE_MAP } from "./types";
import type { TradePoint } from "./types";
import type { Brick } from "./bricks";
import { HoverCard } from "./HoverCard";
import { Legend } from "./Legend";
import { MapToolbar, type Tool } from "./MapToolbar";

// Растровая подложка CARTO (как в референсе) — светлый стиль без токена.
const TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DRAW_STYLE = { color: "#0f172a", weight: 2, dashArray: "5 4" };

function iconSvg(inner: string) {
	return (
		'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
		inner +
		"</svg>"
	);
}

function pinDivIcon(p: TradePoint) {
	const t = TYPE_MAP[p.type];
	const html =
		'<div class="ttpin" style="width:28px;height:28px;border-radius:50%;background:' +
		t.color +
		';border:2px solid #fff;box-shadow:0 1px 4px rgba(15,23,42,.4);display:flex;align-items:center;justify-content:center;transition:transform .12s ease, box-shadow .12s ease;">' +
		iconSvg(t.icon) +
		"</div>";
	return L.divIcon({ html, className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
}

function clusterIcon(cluster: L.MarkerCluster) {
	const n = cluster.getChildCount();
	const size = n < 10 ? 36 : n < 50 ? 44 : n < 200 ? 52 : 60;
	const html =
		'<div style="width:' +
		size +
		"px;height:" +
		size +
		'px;border-radius:50%;background:rgba(15,23,42,.92);border:3px solid rgba(255,255,255,.92);box-shadow:0 2px 8px rgba(15,23,42,.4);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;">' +
		n +
		"</div>";
	return L.divIcon({ html, className: "", iconSize: [size, size] });
}

type Hover = { point: TradePoint; x: number; y: number; below: boolean };

function setPin(marker: L.Marker, highlighted: boolean) {
	const node = (marker as unknown as { _icon?: HTMLElement })._icon?.querySelector<HTMLElement>(".ttpin");
	if (node) {
		node.style.transform = highlighted ? "scale(1.42)" : "";
		node.style.boxShadow = highlighted
			? "0 0 0 4px rgba(15,23,42,.16),0 3px 9px rgba(15,23,42,.5)"
			: "0 1px 4px rgba(15,23,42,.4)";
		node.style.zIndex = highlighted ? "1000" : "";
	}
	marker.setZIndexOffset(highlighted ? 1000 : 0);
}

/** Запрос «сместить карту к объекту». nonce меняется при каждом вызове, чтобы эффект срабатывал повторно. */
export type FocusRequest =
	| { nonce: number; kind: "brick"; id: string }
	| { nonce: number; kind: "point"; lat: number; lng: number };

type MapViewProps = {
	bricks: Brick[];
	selectedBrickId: string | null;
	editing: boolean;
	focusRequest: FocusRequest | null;
	onSelectPoint: (p: TradePoint) => void;
	onSelectBrick: (id: string) => void;
	onCreateBrick: (latlngs: [number, number][]) => void;
	onUpdateBrick: (id: string, latlngs: [number, number][]) => void;
};

/**
 * Карта Москвы: торговые точки (кластеризация) + полигоны бриков.
 * Инструменты Квадрат/Лассо/Полигон рисуют область → создаётся брик.
 */
export function MapView({
	bricks,
	selectedBrickId,
	editing,
	focusRequest,
	onSelectPoint,
	onSelectBrick,
	onCreateBrick,
	onUpdateBrick
}: MapViewProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<L.Map | null>(null);
	const brickLayersRef = useRef<Record<string, L.Polygon>>({});
	const cancelDrawRef = useRef<() => void>(() => {});
	const [hover, setHover] = useState<Hover | null>(null);
	const [tool, setTool] = useState<Tool>("cursor");
	const [opacity, setOpacity] = useState(0.55);
	// Свежие значения без пересоздания карты (mount-эффект с пустыми зависимостями).
	const toolRef = useRef(tool);
	toolRef.current = tool;
	const selectPointRef = useRef(onSelectPoint);
	selectPointRef.current = onSelectPoint;
	const selectBrickRef = useRef(onSelectBrick);
	selectBrickRef.current = onSelectBrick;
	const createBrickRef = useRef(onCreateBrick);
	createBrickRef.current = onCreateBrick;
	const updateBrickRef = useRef(onUpdateBrick);
	updateBrickRef.current = onUpdateBrick;

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const map = L.map(el, { zoomControl: false, attributionControl: true }).setView(
			[55.751, 37.621],
			11
		);
		mapRef.current = map;
		L.tileLayer(TILE_URL, {
			attribution: "© OpenStreetMap, © CARTO",
			subdomains: "abcd",
			maxZoom: 19
		}).addTo(map);
		L.control.zoom({ position: "bottomright" }).addTo(map);

		// ---------- hover точки ----------
		let hl: L.Marker | null = null;
		const showHover = (p: TradePoint, m: L.Marker) => {
			if (toolRef.current !== "cursor") return;
			if (hl && hl !== m) setPin(hl, false);
			hl = m;
			setPin(m, true);
			const cp = map.latLngToContainerPoint(m.getLatLng());
			setHover({ point: p, x: cp.x, y: cp.y, below: cp.y < 185 });
		};
		const hideHover = (m?: L.Marker) => {
			const target = m || hl;
			if (target) setPin(target, false);
			hl = null;
			setHover(null);
		};

		// ---------- рисование бриков ----------
		let lassoActive = false;
		let lassoPts: [number, number][] = [];
		let lassoLine: L.Polyline | null = null;
		let sqActive = false;
		let sqStart: L.LatLng | null = null;
		let sqRect: L.Rectangle | null = null;
		let polyVerts: [number, number][] = [];
		let tmpLine: L.Polyline | null = null;
		let tmpMarkers: L.CircleMarker[] = [];

		const cancelDraw = () => {
			lassoActive = false;
			if (lassoLine) map.removeLayer(lassoLine);
			lassoLine = null;
			lassoPts = [];
			sqActive = false;
			if (sqRect) map.removeLayer(sqRect);
			sqRect = null;
			sqStart = null;
			if (tmpLine) map.removeLayer(tmpLine);
			tmpLine = null;
			tmpMarkers.forEach((m) => map.removeLayer(m));
			tmpMarkers = [];
			polyVerts = [];
			map.dragging.enable();
		};
		cancelDrawRef.current = cancelDraw;

		const finishBrick = (latlngs: [number, number][]) => {
			createBrickRef.current(latlngs);
			setTool("cursor");
		};

		// Прореживание freehand-контура лассо (Douglas–Peucker в пикселях),
		// чтобы у брика было немного вершин и его можно было редактировать как полигон.
		const simplifyLasso = (pts: [number, number][]): [number, number][] => {
			if (pts.length <= 4) return pts;
			const projected = pts.map(([lat, lng]) => map.latLngToLayerPoint(L.latLng(lat, lng)));
			return L.LineUtil.simplify(projected, 6).map((pt) => {
				const ll = map.layerPointToLatLng(pt);
				return [ll.lat, ll.lng] as [number, number];
			});
		};

		const drawTmpPoly = () => {
			if (tmpLine) map.removeLayer(tmpLine);
			tmpLine = null;
			tmpMarkers.forEach((m) => map.removeLayer(m));
			tmpMarkers = [];
			if (!polyVerts.length) return;
			const ring = polyVerts.concat(polyVerts.length > 2 ? [polyVerts[0]] : []);
			tmpLine = L.polyline(ring, DRAW_STYLE).addTo(map);
			polyVerts.forEach((v, i) => {
				tmpMarkers.push(
					L.circleMarker(v, {
						radius: i === 0 ? 6 : 4,
						color: "#0f172a",
						fillColor: i === 0 ? "#0f172a" : "#fff",
						fillOpacity: 1,
						weight: 2
					}).addTo(map)
				);
			});
		};

		const finishPolygon = () => {
			if (polyVerts.length < 3) return;
			const verts = polyVerts.slice();
			cancelDraw();
			finishBrick(verts);
		};

		const onDown = (e: L.LeafletMouseEvent) => {
			const t = toolRef.current;
			if (t === "lasso") {
				lassoActive = true;
				hideHover();
				map.dragging.disable();
				lassoPts = [[e.latlng.lat, e.latlng.lng]];
				lassoLine = L.polyline(lassoPts, DRAW_STYLE).addTo(map);
			} else if (t === "square") {
				sqActive = true;
				hideHover();
				map.dragging.disable();
				sqStart = e.latlng;
				sqRect = L.rectangle(L.latLngBounds(e.latlng, e.latlng), {
					...DRAW_STYLE,
					fillColor: "#0f172a",
					fillOpacity: 0.08
				}).addTo(map);
			}
		};
		const onMove = (e: L.LeafletMouseEvent) => {
			if (lassoActive && lassoLine) {
				lassoPts.push([e.latlng.lat, e.latlng.lng]);
				lassoLine.setLatLngs(lassoPts);
			} else if (sqActive && sqRect && sqStart) {
				sqRect.setBounds(L.latLngBounds(sqStart, e.latlng));
			}
		};
		const onUp = (e: L.LeafletMouseEvent) => {
			if (lassoActive) {
				lassoActive = false;
				map.dragging.enable();
				if (lassoLine) map.removeLayer(lassoLine);
				lassoLine = null;
				const pts = lassoPts;
				lassoPts = [];
				if (pts.length >= 3) finishBrick(simplifyLasso(pts));
			} else if (sqActive) {
				sqActive = false;
				map.dragging.enable();
				const bounds = sqRect ? sqRect.getBounds() : null;
				if (sqRect) map.removeLayer(sqRect);
				sqRect = null;
				const start = sqStart;
				sqStart = null;
				if (bounds && start && start.distanceTo(e.latlng) > 30) {
					const n = bounds.getNorth();
					const s = bounds.getSouth();
					const w = bounds.getWest();
					const eastEdge = bounds.getEast();
					finishBrick([
						[n, w],
						[n, eastEdge],
						[s, eastEdge],
						[s, w]
					]);
				}
			}
		};
		const onClick = (e: L.LeafletMouseEvent) => {
			if (toolRef.current !== "polygon") return;
			if (polyVerts.length >= 3) {
				const fp = map.latLngToContainerPoint(L.latLng(polyVerts[0]));
				const cp = map.latLngToContainerPoint(e.latlng);
				if (Math.hypot(fp.x - cp.x, fp.y - cp.y) < 14) {
					finishPolygon();
					return;
				}
			}
			polyVerts.push([e.latlng.lat, e.latlng.lng]);
			drawTmpPoly();
		};
		const onDbl = (e: L.LeafletMouseEvent) => {
			if (toolRef.current === "polygon" && polyVerts.length >= 3) {
				L.DomEvent.stop(e);
				finishPolygon();
			}
		};

		map.on("mousedown", onDown);
		map.on("mousemove", onMove);
		map.on("mouseup", onUp);
		map.on("click", onClick);
		map.on("dblclick", onDbl);

		// ---------- торговые точки ----------
		const cluster = L.markerClusterGroup({
			maxClusterRadius: (z) => (z >= 13 ? 22 : z >= 11 ? 34 : 50),
			disableClusteringAtZoom: 14,
			showCoverageOnHover: false,
			spiderfyOnMaxZoom: true,
			chunkedLoading: true,
			iconCreateFunction: clusterIcon
		});
		cluster.addLayers(
			TRADE_POINTS.map((p) => {
				const m = L.marker([p.lat, p.lng], { icon: pinDivIcon(p) });
				m.on("mouseover", () => showHover(p, m));
				m.on("mouseout", () => hideHover(m));
				m.on("click", (e) => {
					if (toolRef.current !== "cursor") return;
					L.DomEvent.stopPropagation(e);
					hideHover(m);
					selectPointRef.current(p);
				});
				return m;
			})
		);
		map.addLayer(cluster);
		map.on("movestart zoomstart", () => hideHover());

		// Перерисовываем тайлы при изменении размера контейнера (перетаскивание Resizable).
		// invalidateSize — на следующем кадре, чтобы не реагировать синхронно в коллбэке ResizeObserver.
		let raf = 0;
		const ro = new ResizeObserver(() => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => map.invalidateSize());
		});
		ro.observe(el);

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			map.remove();
			mapRef.current = null;
			brickLayersRef.current = {};
		};
	}, []);

	// Синхронизация полигонов бриков с состоянием + подсветка выбранного.
	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;
		for (const brick of bricks) {
			let poly = brickLayersRef.current[brick.id];
			if (!poly) {
				poly = L.polygon(brick.latlngs, {
					color: "rgba(15,23,42,.5)",
					weight: 1.2,
					fillColor: brick.color,
					fillOpacity: 0.55
				});
				poly.on("click", (e) => {
					if (toolRef.current !== "cursor") return;
					L.DomEvent.stopPropagation(e);
					selectBrickRef.current(brick.id);
				});
				poly.addTo(map);
				brickLayersRef.current[brick.id] = poly;
			}
			const sel = brick.id === selectedBrickId;
			poly.setStyle({
				fillColor: brick.color,
				weight: sel ? 3 : 1.2,
				color: sel ? "#0f172a" : "rgba(15,23,42,.5)",
				fillOpacity: sel ? Math.min(0.95, opacity + 0.18) : opacity
			});
			if (sel) poly.bringToFront();
		}
		// Удалить полигоны бриков, которых больше нет в состоянии.
		const ids = new Set(bricks.map((b) => b.id));
		for (const id of Object.keys(brickLayersRef.current)) {
			if (!ids.has(id)) {
				map.removeLayer(brickLayersRef.current[id]);
				delete brickLayersRef.current[id];
			}
		}
	}, [bricks, selectedBrickId, opacity]);

	// Реакция на смену инструмента: отменить рисование, сменить курсор, dblclick-зум.
	useEffect(() => {
		cancelDrawRef.current();
		const map = mapRef.current;
		if (!map) return;
		map.getContainer().style.cursor = tool === "cursor" ? "" : "crosshair";
		if (tool === "polygon") map.doubleClickZoom.disable();
		else map.doubleClickZoom.enable();
	}, [tool]);

	// Смещение карты к выбранному объекту по запросу из правой панели.
	useEffect(() => {
		const map = mapRef.current;
		if (!map || !focusRequest) return;
		if (focusRequest.kind === "point") {
			map.flyTo([focusRequest.lat, focusRequest.lng], Math.max(map.getZoom(), 14), {
				duration: 0.6
			});
		} else {
			const poly = brickLayersRef.current[focusRequest.id];
			if (poly) map.flyToBounds(poly.getBounds(), { padding: [48, 48], duration: 0.6 });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [focusRequest?.nonce]);

	// Редактирование вершин выбранного брика через Leaflet-Geoman.
	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;
		// На всех бриках, кроме редактируемого, выключаем режим правки.
		for (const [id, poly] of Object.entries(brickLayersRef.current)) {
			if (poly.pm.enabled() && !(editing && id === selectedBrickId)) poly.pm.disable();
		}
		if (!editing || !selectedBrickId) return;
		setTool("cursor");
		const poly = brickLayersRef.current[selectedBrickId];
		if (!poly) return;
		if (!poly.pm.enabled())
			poly.pm.enable({ allowSelfIntersection: false, removeVertexOn: "contextmenu dblclick" });

		const sync = () => {
			const ring = poly.getLatLngs()[0] as L.LatLng[];
			updateBrickRef.current(
				selectedBrickId,
				ring.map((p) => [p.lat, p.lng] as [number, number])
			);
		};
		poly.on("pm:markerdragend", sync);
		poly.on("pm:vertexadded", sync);
		poly.on("pm:vertexremoved", sync);
		return () => {
			poly.off("pm:markerdragend", sync);
			poly.off("pm:vertexadded", sync);
			poly.off("pm:vertexremoved", sync);
		};
	}, [editing, selectedBrickId]);

	return (
		<div className="relative h-full w-full">
			<div ref={containerRef} className="h-full w-full" style={{ background: "#eef2f6" }} />
			<MapToolbar tool={tool} onToolChange={setTool} />
			<Legend opacity={opacity} onOpacityChange={setOpacity} />
			{hover && (
				<div
					className="pointer-events-none absolute z-[600]"
					style={{
						left: hover.x,
						top: hover.y,
						transform: hover.below
							? "translate(-50%, 20px)"
							: "translate(-50%, calc(-100% - 18px))"
					}}
				>
					<HoverCard point={hover.point} />
				</div>
			)}
		</div>
	);
}
