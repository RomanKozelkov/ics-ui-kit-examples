import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "./RetailHeatmap.css";
import { area, intersection, lineCorridor, toLatLngs } from "./geo";
import { CITY_BBOX } from "./moscowGeo";
import { POINT_TYPE_MAP, type MultiPoly, type Pair, type Territory, type TradePoint } from "./types";
import { HoverCard } from "./HoverCard";
import { MapToolbar, type Tool } from "./MapToolbar";

/**
 * Растровая подложка OpenStreetMap — без ключа и без ограничений на масштаб.
 *
 * Раньше здесь был светлый стиль CARTO: с 2024 года `basemaps.cartocdn.com` печатает поверх
 * тайлов «API KEY REQUIRED», поэтому подложка заменена. Пёстрый стиль OSM спорит с заливкой
 * территорий, и он приглушается фильтром в CSS (`.rh-map .leaflet-tile-pane`).
 */
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const DRAW_STYLE = { color: "#0f172a", weight: 2, dashArray: "5 4" };
/**
 * Правка границ брика — по образцу линейки Яндекс Карт: вершину тянут, середину ребра тянут,
 * чтобы добавить вершину, клик по вершине её удаляет. Вершины прилипают к границам соседних
 * территорий, чтобы брик можно было довести ровно до района, не оставив щели.
 */
const EDIT_OPTIONS = {
	allowSelfIntersection: false,
	removeVertexOn: "click",
	removeLayerBelowMinVertexCount: false,
	draggable: false,
	snappable: true,
	snapDistance: 12
} as const;

/** Панель маркеров точек: ниже вершин правки, чтобы булавки не перекрывали их. */
const POINTS_PANE = "rhPoints";

/** Ширина полосы разреза в градусах (≈ 30 м). */
const CUT_WIDTH = 0.0003;

/**
 * Слой территорий, который залит цветом и доступен для выбора кликом: базовая география
 * (округа или районы) либо только кастомные брики.
 */
export type MapLayer = "okrug" | "rayon" | "brick";

/** Запрос «сместить карту к объекту»; nonce меняется при каждом вызове. */
export type FocusRequest =
	| { nonce: number; kind: "territory"; id: string }
	| { nonce: number; kind: "point"; lat: number; lng: number };

function iconSvg(inner: string) {
	return (
		'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
		inner +
		"</svg>"
	);
}

function pinDivIcon(point: TradePoint) {
	const meta = POINT_TYPE_MAP[point.type];
	const html =
		'<div class="ttpin" style="width:28px;height:28px;border-radius:50%;background:' +
		meta.color +
		';border:2px solid #fff;box-shadow:0 1px 4px rgba(15,23,42,.4);display:flex;align-items:center;justify-content:center;transition:transform .12s ease, box-shadow .12s ease;">' +
		iconSvg(meta.icon) +
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

function setPin(marker: L.Marker, highlighted: boolean) {
	const node = (marker as unknown as { _icon?: HTMLElement })._icon?.querySelector<HTMLElement>(".ttpin");
	if (node) {
		node.style.transform = highlighted ? "scale(1.42)" : "";
		node.style.boxShadow = highlighted
			? "0 0 0 4px rgba(15,23,42,.16),0 3px 9px rgba(15,23,42,.5)"
			: "0 1px 4px rgba(15,23,42,.4)";
	}
	marker.setZIndexOffset(highlighted ? 1000 : 0);
}

/** Вложенные массивы Leaflet → мультиполигон в порядке GeoJSON. */
function latLngsToMultiPoly(latlngs: unknown): MultiPoly {
	const toRing = (ring: L.LatLng[]) => {
		const result: Pair[] = ring.map((p) => [p.lng, p.lat] as Pair);
		if (result.length && (result[0][0] !== result[result.length - 1][0] || result[0][1] !== result[result.length - 1][1])) {
			result.push([result[0][0], result[0][1]]);
		}
		return result;
	};
	const level = latlngs as L.LatLng[] | L.LatLng[][] | L.LatLng[][][];
	if (!Array.isArray(level) || !level.length) return [];
	const first = level[0] as unknown;
	if (!Array.isArray(first)) return [[toRing(level as L.LatLng[])]];
	const second = (first as unknown[])[0];
	if (!Array.isArray(second)) return [(level as L.LatLng[][]).map(toRing)];
	return (level as L.LatLng[][][]).map((poly) => poly.map(toRing));
}

type Hover = { point: TradePoint; x: number; y: number; below: boolean };

type MapViewProps = {
	/** Территории для отрисовки: брики и базовый слой выбранного уровня. */
	visible: Territory[];
	/** Отображаемая геометрия по id (базовая — за вычетом бриков). */
	effective: Record<string, MultiPoly>;
	/** Цвет заливки территории по метрике раскраски. */
	colors: Record<string, string>;
	points: TradePoint[];
	selectedTerritoryId: string | null;
	selectedPointCode: string | null;
	editing: boolean;
	opacity: number;
	tool: Tool;
	focusRequest: FocusRequest | null;
	canUndo: boolean;
	/** Сообщение о результате операции нарезки — показывается поверх карты. */
	notice: string | null;
	onToolChange: (tool: Tool) => void;
	onUndo: () => void;
	onSelectPoint: (point: TradePoint) => void;
	onSelectTerritory: (id: string) => void;
	/** Клик по пустому месту карты — снять выбор. */
	onClearSelection: () => void;
	onSplitTerritory: (targetId: string, corridor: MultiPoly) => void;
	onMergeTerritories: (ids: string[]) => void;
	/** Новая граница брика; `false` — правка отклонена и контур нужно вернуть. */
	onUpdateBrick: (id: string, geometry: MultiPoly) => boolean;
	children?: React.ReactNode;
};

/**
 * Карта: базовый слой округов и районов (треб. 2.1), кастомные брики поверх него (треб. 2.5),
 * маркеры торговых точек с учётом фильтров и инструменты нарезки (треб. 2.3).
 */
export function MapView({
	visible,
	effective,
	colors,
	points,
	selectedTerritoryId,
	selectedPointCode,
	editing,
	opacity,
	tool,
	focusRequest,
	canUndo,
	notice,
	onToolChange,
	onUndo,
	onSelectPoint,
	onSelectTerritory,
	onClearSelection,
	onSplitTerritory,
	onMergeTerritories,
	onUpdateBrick,
	children
}: MapViewProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<L.Map | null>(null);
	const layersRef = useRef<Record<string, L.Polygon>>({});
	const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
	const cancelDrawRef = useRef<() => void>(() => {});
	// Обработчики наведения создаются вместе с картой и переиспользуются при пересоздании маркеров.
	const markerHandlersRef = useRef<{
		showHover: (point: TradePoint, marker: L.Marker) => void;
		hideHover: (marker?: L.Marker) => void;
	} | null>(null);
	const [hover, setHover] = useState<Hover | null>(null);
	const [mergeIds, setMergeIds] = useState<string[]>([]);
	// Число уже поставленных вершин — по нему включается кнопка «Готово».
	const [vertexCount, setVertexCount] = useState(0);
	// Завершение и отмена построения: вызываются из кнопок подсказки, а не только двойным кликом.
	const drawApiRef = useRef<{ finish: () => void; cancel: () => void }>({
		finish: () => {},
		cancel: () => {}
	});

	// Свежие значения для обработчиков карты, созданных один раз при монтировании.
	const toolRef = useRef(tool);
	toolRef.current = tool;
	const visibleRef = useRef(visible);
	visibleRef.current = visible;
	const effectiveRef = useRef(effective);
	effectiveRef.current = effective;
	const callbacks = useRef({
		onSelectPoint,
		onSelectTerritory,
		onClearSelection,
		onSplitTerritory,
		onUpdateBrick,
		onToolChange
	});
	callbacks.current = {
		onSelectPoint,
		onSelectTerritory,
		onClearSelection,
		onSplitTerritory,
		onUpdateBrick,
		onToolChange
	};

	/* ---------- инициализация карты и инструментов ---------- */

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		// `zoomSnap` дробный: между целыми уровнями масштаб отличается вдвое, и подгонка под
		// рамку города теряла до половины размера — город занимал меньше половины карты.
		const map = L.map(el, {
			zoomControl: false,
			attributionControl: true,
			zoomSnap: 0.25,
			zoomDelta: 0.5
		}).setView([55.751, 37.621], 10);
		// Стартовый вид — по реальной рамке города (треб. 3.4). Подгонять можно только после
		// того, как контейнер получил размеры: иначе Leaflet считает масштаб по нулевой ширине.
		const cityBounds = L.latLngBounds(
			[CITY_BBOX.minLat, CITY_BBOX.minLng],
			[CITY_BBOX.maxLat, CITY_BBOX.maxLng]
		);
		// Пока идёт первичная раскладка, контейнер меняет размер несколько раз, и подгонка по
		// первому же размеру даёт слишком мелкий масштаб. Поэтому подгоняем на каждом изменении
		// размера и прекращаем, как только пользователь сам взялся за карту.
		let autoFit = true;
		const fitCity = () => {
			if (!autoFit || el.clientWidth < 50 || el.clientHeight < 50) return;
			map.fitBounds(cityBounds, { padding: [24, 24], animate: false });
		};
		const stopAutoFit = () => {
			autoFit = false;
		};
		map.on("dragstart", stopAutoFit);
		el.addEventListener("wheel", stopAutoFit, { passive: true });
		// Раскладка успевает устояться заметно быстрее; дальше размер меняет уже пользователь.
		const autoFitTimer = window.setTimeout(stopAutoFit, 2500);
		mapRef.current = map;
		L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map);
		L.control.zoom({ position: "bottomright" }).addTo(map);
		// Своя панель для точек: её можно сделать некликабельной на время разреза и правки,
		// не трогая `markerPane`, где живут вершины редактирования Geoman.
		const pointsPane = map.createPane(POINTS_PANE);
		pointsPane.style.zIndex = "590";
		// ---------- hover точки ----------
		let highlighted: L.Marker | null = null;
		const showHover = (point: TradePoint, marker: L.Marker) => {
			if (toolRef.current !== "cursor") return;
			if (highlighted && highlighted !== marker) setPin(highlighted, false);
			highlighted = marker;
			setPin(marker, true);
			const cp = map.latLngToContainerPoint(marker.getLatLng());
			setHover({ point, x: cp.x, y: cp.y, below: cp.y < 250 });
		};
		const hideHover = (marker?: L.Marker) => {
			const target = marker || highlighted;
			if (target) setPin(target, false);
			highlighted = null;
			setHover(null);
		};
		markerHandlersRef.current = { showHover, hideHover };

		// ---------- разрез ----------
		// Новые брики не рисуются с нуля (решение по итогам показа прототипа): брик получается
		// разрезом или объединением существующих территорий и дальше правится по вершинам.
		let cutVerts: [number, number][] = [];
		let tmpLine: L.Polyline | null = null;
		let tmpMarkers: L.CircleMarker[] = [];

		const cancelDraw = () => {
			if (tmpLine) map.removeLayer(tmpLine);
			tmpLine = null;
			tmpMarkers.forEach((m) => map.removeLayer(m));
			tmpMarkers = [];
			cutVerts = [];
			setVertexCount(0);
		};
		cancelDrawRef.current = cancelDraw;

		const drawTmpLine = (verts: [number, number][]) => {
			if (tmpLine) map.removeLayer(tmpLine);
			tmpLine = null;
			tmpMarkers.forEach((m) => map.removeLayer(m));
			tmpMarkers = [];
			setVertexCount(verts.length);
			if (!verts.length) return;
			tmpLine = L.polyline(verts, DRAW_STYLE).addTo(map);
			verts.forEach((v, i) => {
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

		/** Территория, которую пересекает полоса разреза сильнее всего. */
		const cutTarget = (corridor: MultiPoly): string | null => {
			let bestId: string | null = null;
			let bestArea = 0;
			for (const territory of visibleRef.current) {
				const geometry = effectiveRef.current[territory.id];
				if (!geometry?.length) continue;
				const overlap = area(intersection(geometry, corridor));
				if (overlap > bestArea) {
					bestArea = overlap;
					bestId = territory.id;
				}
			}
			return bestId;
		};

		const finishCut = () => {
			if (cutVerts.length < 2) return;
			const line: Pair[] = cutVerts.map(([lat, lng]) => [lng, lat] as Pair);
			const corridor = lineCorridor(line, CUT_WIDTH);
			const targetId = cutTarget(corridor);
			cancelDraw();
			// Линию, не задевшую ни одной территории, тоже отдаём наверх — чтобы показать ответ.
			callbacks.current.onSplitTerritory(targetId ?? "", corridor);
			callbacks.current.onToolChange("cursor");
		};

		const onClick = () => {
			const current = toolRef.current;
			// Клик по территории или точке останавливает событие в их обработчиках, поэтому сюда
			// доходит только клик по пустому месту карты — он снимает выбор.
			if (current === "cursor") callbacks.current.onClearSelection();
		};

		const onCutClick = (e: L.LeafletMouseEvent) => {
			if (toolRef.current !== "cut") return;
			cutVerts.push([e.latlng.lat, e.latlng.lng]);
			drawTmpLine(cutVerts);
		};

		const onDbl = (e: L.LeafletMouseEvent) => {
			if (toolRef.current === "cut" && cutVerts.length >= 2) {
				L.DomEvent.stop(e);
				finishCut();
			}
		};

		drawApiRef.current = {
			finish: () => {
				if (toolRef.current === "cut") finishCut();
			},
			cancel: () => {
				cancelDraw();
				callbacks.current.onToolChange("cursor");
			}
		};

		map.on("click", onClick);
		map.on("click", onCutClick);
		map.on("dblclick", onDbl);
		map.on("movestart zoomstart", () => hideHover());

		// Перерисовка тайлов при изменении размера контейнера (перетаскивание разделителя).
		let raf = 0;
		const ro = new ResizeObserver(() => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				map.invalidateSize();
				fitCity();
			});
		});
		ro.observe(el);

		return () => {
			window.clearTimeout(autoFitTimer);
			el.removeEventListener("wheel", stopAutoFit);
			cancelAnimationFrame(raf);
			ro.disconnect();
			map.remove();
			mapRef.current = null;
			layersRef.current = {};
			clusterRef.current = null;
		};
	}, []);

	/* ---------- полигоны территорий ---------- */

	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;
		const layers = layersRef.current;
		const ids = new Set(visible.map((t) => t.id));

		for (const id of Object.keys(layers)) {
			if (!ids.has(id)) {
				map.removeLayer(layers[id]);
				delete layers[id];
			}
		}

		for (const territory of visible) {
			const geometry = effective[territory.id];
			if (!geometry?.length) continue;
			const latlngs = toLatLngs(geometry);
			const existing = layers[territory.id];
			if (existing) {
				existing.setLatLngs(latlngs);
				// Geoman не следит за внешней заменой контура: его вершины остались бы на старой
				// геометрии, и следующая правка шла бы по ней. Пересобираем их по новому контуру —
				// после отсечения по городу и соседним брикам он отличается от того, что тянули.
				if (existing.pm.enabled()) {
					existing.pm.disable();
					existing.pm.enable(EDIT_OPTIONS);
				}
				// Подпись привязана к центру контура — после правки границ её нужно подвинуть.
				const tooltip = existing.getTooltip();
				if (tooltip) {
					tooltip.setContent(territory.name);
					tooltip.setLatLng(existing.getCenter());
				}
				continue;
			}
			const poly = L.polygon(latlngs, { interactive: true });
			poly.on("click", (e) => {
				if (toolRef.current === "cursor") {
					L.DomEvent.stopPropagation(e);
					callbacks.current.onSelectTerritory(territory.id);
				} else if (toolRef.current === "merge") {
					L.DomEvent.stopPropagation(e);
					setMergeIds((prev) =>
						prev.includes(territory.id)
							? prev.filter((id) => id !== territory.id)
							: [...prev, territory.id]
					);
				}
			});
			poly.addTo(map);
			// Название брика подписывается прямо на карте: базовые округа и районы подписаны на
			// подложке, а брики придумывает пользователь. Подпись намеренно приглушённая — она
			// не должна спорить с точками и заливкой (стили в `RetailHeatmap.css`).
			if (territory.kind === "brick") {
				poly.bindTooltip(territory.name, {
					permanent: true,
					direction: "center",
					className: "rh-brick-label",
					interactive: false
				});
			}
			layers[territory.id] = poly;
		}
	}, [visible, effective]);

	// Стили считаем отдельно — они меняются чаще геометрии (фильтры, метрика, выбор).
	useEffect(() => {
		for (const territory of visible) {
			const poly = layersRef.current[territory.id];
			if (!poly) continue;
			const isBrick = territory.kind === "brick";
			const selected = territory.id === selectedTerritoryId;
			const merging = mergeIds.includes(territory.id);
			poly.setStyle({
				fillColor: colors[territory.id] ?? "#cbd5e1",
				fillOpacity: selected ? Math.min(0.95, opacity + 0.18) : opacity,
				// Кастомный брик отличается от базовых границ штриховым тёмным контуром (треб. 2.5).
				color: merging ? "#2563eb" : selected ? "#0f172a" : isBrick ? "#0f172a" : "rgba(15,23,42,.45)",
				weight: merging ? 3 : selected ? 3 : isBrick ? 2.2 : 1.1,
				dashArray: isBrick ? "6 4" : undefined
			});
			if (selected || merging || isBrick) poly.bringToFront();
		}
	}, [visible, colors, opacity, selectedTerritoryId, mergeIds]);

	/* ---------- маркеры точек ---------- */

	useEffect(() => {
		const map = mapRef.current;
		const handlers = markerHandlersRef.current;
		if (!map || !handlers) return;
		if (clusterRef.current) map.removeLayer(clusterRef.current);

		const cluster = L.markerClusterGroup({
			maxClusterRadius: (z) => (z >= 13 ? 22 : z >= 11 ? 34 : 50),
			disableClusteringAtZoom: 14,
			showCoverageOnHover: false,
			spiderfyOnMaxZoom: true,
			chunkedLoading: true,
			iconCreateFunction: clusterIcon,
			clusterPane: POINTS_PANE
		});
		cluster.addLayers(
			points.map((point) => {
				const marker = L.marker([point.lat, point.lng], { icon: pinDivIcon(point), pane: POINTS_PANE });
				marker.on("mouseover", () => handlers.showHover(point, marker));
				marker.on("mouseout", () => handlers.hideHover(marker));
				marker.on("click", (e) => {
					if (toolRef.current !== "cursor") return;
					L.DomEvent.stopPropagation(e);
					handlers.hideHover(marker);
					callbacks.current.onSelectPoint(point);
				});
				return marker;
			})
		);
		map.addLayer(cluster);
		clusterRef.current = cluster;
	}, [points]);

	/* ---------- реакция на смену инструмента ---------- */

	useEffect(() => {
		cancelDrawRef.current();
		if (tool !== "merge") setMergeIds([]);
		const map = mapRef.current;
		if (!map) return;
		map.getContainer().style.cursor = tool === "cursor" ? "" : "crosshair";
		if (tool === "cut") map.doubleClickZoom.disable();
		else map.doubleClickZoom.enable();
	}, [tool]);

	// Во время разреза, объединения и правки границ точки не должны перехватывать клики: по
	// плотной карте иначе не поставить вершину и не взять её — клик попадает в булавку.
	useEffect(() => {
		const pane = mapRef.current?.getPane(POINTS_PANE);
		if (pane) pane.style.pointerEvents = tool === "cursor" && !editing ? "" : "none";
		if (editing) markerHandlersRef.current?.hideHover();
	}, [tool, editing]);

	/* ---------- центрирование по запросу ---------- */

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !focusRequest) return;
		if (focusRequest.kind === "point") {
			map.flyTo([focusRequest.lat, focusRequest.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
		} else {
			const poly = layersRef.current[focusRequest.id];
			if (poly) map.flyToBounds(poly.getBounds(), { padding: [48, 48], duration: 0.6 });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [focusRequest?.nonce]);

	/* ---------- правка границ выбранного брика ---------- */

	useEffect(() => {
		const map = mapRef.current;
		if (!map) return;
		for (const [id, poly] of Object.entries(layersRef.current)) {
			if (poly.pm.enabled() && !(editing && id === selectedTerritoryId)) poly.pm.disable();
		}
		if (!editing || !selectedTerritoryId) return;
		const poly = layersRef.current[selectedTerritoryId];
		if (!poly) return;
		if (!poly.pm.enabled()) poly.pm.enable(EDIT_OPTIONS);

		// `pm:edit` приходит один раз на завершённое действие — перетаскивание вершины, новую
		// вершину из середины ребра, удаление. Раньше слушались три события, и добавление вершины
		// давало две записи в историю отмены.
		const sync = () => {
			const geometry = latLngsToMultiPoly(poly.getLatLngs());
			const applied = geometry.length > 0 && callbacks.current.onUpdateBrick(selectedTerritoryId, geometry);
			if (applied) return;
			// Правку отклонили (брик вышел за город или исчез под соседями) — модель не изменилась,
			// и контур на карте нужно вернуть к ней, иначе карта и данные разойдутся.
			const previous = effectiveRef.current[selectedTerritoryId];
			if (!previous?.length) return;
			poly.pm.disable();
			poly.setLatLngs(toLatLngs(previous));
			poly.pm.enable(EDIT_OPTIONS);
		};
		poly.on("pm:edit", sync);
		return () => {
			poly.off("pm:edit", sync);
		};
	}, [editing, selectedTerritoryId]);

	// Подсветка выбранной точки — маркеры пересоздаются, поэтому только для тултипа.
	useEffect(() => {
		if (selectedPointCode) setHover(null);
	}, [selectedPointCode]);

	const drawingHint = tool === "cut" ? "Проведите линию через территорию насквозь" : null;

	return (
		// `isolate` держит слои Leaflet (z-index до 700) внутри собственного контекста наложения —
		// иначе они перекрывают выпадающие списки фильтров, которые портал рендерит в body.
		<div className="rh-map relative isolate h-full w-full">
			<div ref={containerRef} className="h-full w-full" style={{ background: "#eef2f6" }} />
			<MapToolbar tool={tool} onToolChange={onToolChange} canUndo={canUndo} onUndo={onUndo} />

			{(drawingHint || tool === "merge") && (
				<div className="pointer-events-none absolute left-1/2 top-3.5 z-[550] -translate-x-1/2">
					<div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-700 shadow-[0_2px_4px_-2px_rgba(15,23,42,.12),0_4px_8px_-1px_rgba(15,23,42,.12)]">
						{tool === "merge" ? (
							<>
								<span>Выберите территории для объединения</span>
								<span className="rounded bg-slate-100 px-1.5 font-semibold tabular-nums">
									{mergeIds.length}
								</span>
								<button
									type="button"
									disabled={mergeIds.length < 2}
									onClick={() => {
										onMergeTerritories(mergeIds);
										setMergeIds([]);
										onToolChange("cursor");
									}}
									className="rounded-md bg-slate-900 px-2.5 py-1 font-medium text-white disabled:pointer-events-none disabled:opacity-40"
								>
									Объединить
								</button>
								<button
									type="button"
									onClick={() => {
										setMergeIds([]);
										onToolChange("cursor");
									}}
									className="rounded-md px-2 py-1 font-medium text-slate-500 hover:text-slate-900"
								>
									Отмена
								</button>
							</>
						) : (
							<>
								<span>{drawingHint}</span>
								<button
									type="button"
									disabled={vertexCount < 2}
									onClick={() => drawApiRef.current.finish()}
									className="rounded-md bg-slate-900 px-2.5 py-1 font-medium text-white disabled:pointer-events-none disabled:opacity-40"
								>
									Готово
								</button>
								<button
									type="button"
									onClick={() => drawApiRef.current.cancel()}
									className="rounded-md px-2 py-1 font-medium text-slate-500 hover:text-slate-900"
								>
									Отмена
								</button>
							</>
						)}
					</div>
				</div>
			)}

			{notice && (
				<div className="pointer-events-none absolute left-1/2 top-3.5 z-[560] -translate-x-1/2">
					<div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-900 shadow-[0_2px_4px_-2px_rgba(15,23,42,.12),0_4px_8px_-1px_rgba(15,23,42,.12)]">
						{notice}
					</div>
				</div>
			)}

			{hover && (
				<div
					className="pointer-events-none absolute z-[600]"
					style={{
						left: hover.x,
						top: hover.y,
						transform: hover.below ? "translate(-50%, 20px)" : "translate(-50%, calc(-100% - 18px))"
					}}
				>
					<HoverCard point={hover.point} />
				</div>
			)}

			{children}
		</div>
	);
}
