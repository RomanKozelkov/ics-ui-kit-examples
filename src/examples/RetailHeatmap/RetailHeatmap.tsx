import { useEffect, useMemo, useRef, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "ics-ui-kit/components/resizable";
import { draftDemography, fetchCityDemography, fetchTerritoryDemography } from "./api";
import { FiltersBar } from "./FiltersBar";
import { Legend } from "./Legend";
import { MapView, type FocusRequest, type MapLayer } from "./MapView";
import { RightPanel, type DraftTerritory, type Selection, type TerritoryListRow } from "./RightPanel";
import type { Tool } from "./MapToolbar";
import { TRADE_POINTS } from "./mockData";
import {
	applyFilters,
	createDefaultFilters,
	matchesTerritoryFilters,
	toggleFilterValue,
	type FilterDimension,
	type FilterState
} from "./filters";
import { computeStats, heatColor, metricValue, type Stats } from "./stats";
import {
	buildModel,
	createBrick,
	createInitialBricks,
	deleteBrick,
	mergeTerritories,
	renameBrick,
	pointsInGeometry,
	splitTerritory,
	updateBrickGeometry,
	visibleTerritories
} from "./territories";
import { TERRITORY_KIND_LABEL, type ColorMetric, type MultiPoly, type Territory, type TradePoint } from "./types";

/**
 * OPL-145 — бриковый модуль: тепловая карта территорий с торговыми точками.
 *
 * Сверху — горизонтальная панель фильтров во всю ширину (треб. 1.1), ниже карта с базовым
 * слоем округов и районов, кастомными бриками и маркерами точек, справа — панель статистики
 * (треб. 5.1); граница между ними перетаскивается (треб. 1.2).
 */
export function RetailHeatmap() {
	const [bricks, setBricks] = useState<Territory[]>(() => createInitialBricks());
	const [history, setHistory] = useState<Territory[][]>([]);
	const [filters, setFilters] = useState<FilterState>(createDefaultFilters);
	const [localFilters, setLocalFilters] = useState<FilterState>(createDefaultFilters);
	const [selection, setSelection] = useState<Selection>(null);
	const [editing, setEditing] = useState(false);
	const [tool, setTool] = useState<Tool>("cursor");
	const [metric, setMetric] = useState<ColorMetric>("count");
	const [mapLayer, setMapLayer] = useState<MapLayer>("rayon");
	const [opacity, setOpacity] = useState(0.55);
	const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
	/** Контур, который рисуется прямо сейчас, — источник черновика в правой панели. */
	const [draftGeometry, setDraftGeometry] = useState<MultiPoly | null>(null);
	const [notice, setNotice] = useState<string | null>(null);
	const noticeTimer = useRef(0);

	const selectedTerritoryId = selection?.kind === "territory" ? selection.id : null;

	const model = useMemo(() => buildModel(bricks), [bricks]);

	// Фильтр в границах территории и режим правки живут только внутри выбранной территории.
	useEffect(() => {
		setEditing(false);
		setLocalFilters(createDefaultFilters());
	}, [selectedTerritoryId]);

	/* ---------- производные данные ---------- */

	const globalPoints = useMemo(() => applyFilters(TRADE_POINTS, filters), [filters]);

	/**
	 * Территории для отрисовки. Брики лежат поверх базового слоя (треб. 2.5), поэтому видны
	 * и на округах, и на районах; слой «Брики» показывает только их, без базовой географии.
	 */
	const visible = useMemo(
		() =>
			visibleTerritories(model).filter((t) => {
				const onLayer = mapLayer === "brick" ? t.kind === "brick" : t.kind === "brick" || t.kind === mapLayer;
				return onLayer && matchesTerritoryFilters(t, filters);
			}),
		[model, mapLayer, filters]
	);

	/** Точки территорий с учётом глобальных фильтров; округ агрегирует свои районы. */
	const pointsByTerritory = useMemo(() => {
		const buckets: Record<string, TradePoint[]> = {};
		for (const territory of model.all) buckets[territory.id] = [];
		for (const point of globalPoints) {
			const id = model.pointTerritoryId[point.code];
			if (id && buckets[id]) buckets[id].push(point);
		}
		for (const [okrugId, children] of Object.entries(model.childRayons)) {
			buckets[okrugId] = children.flatMap((id) => buckets[id] ?? []);
		}
		return buckets;
	}, [model, globalPoints]);

	const statsByTerritory = useMemo(() => {
		const result: Record<string, Stats> = {};
		for (const territory of model.all) result[territory.id] = computeStats(pointsByTerritory[territory.id] ?? []);
		return result;
	}, [model, pointsByTerritory]);

	/** Раскраска: значение метрики нормируется по максимуму среди видимых территорий (треб. 7.1). */
	const { colors, maxMetricValue } = useMemo(() => {
		const values = visible.map((t) => metricValue(statsByTerritory[t.id], metric));
		const max = Math.max(1, ...values);
		const map: Record<string, string> = {};
		visible.forEach((t, i) => (map[t.id] = heatColor(values[i] / max)));
		return { colors: map, maxMetricValue: max };
	}, [visible, statsByTerritory, metric]);

	const selectedTerritory = selectedTerritoryId ? model.byId[selectedTerritoryId] ?? null : null;

	/**
	 * Точки на карте. Когда территория выбрана, на карте остаются только её точки — карта
	 * показывает ровно то, что разобрано в правой панели. Фильтр в границах территории при
	 * этом действует только на них и не меняет данные остальных территорий (треб. 5.5.2).
	 */
	const mapPoints = useMemo(() => {
		if (!selectedTerritoryId) return globalPoints;
		return applyFilters(pointsByTerritory[selectedTerritoryId] ?? [], localFilters);
	}, [globalPoints, selectedTerritoryId, pointsByTerritory, localFilters]);

	const panelStats = useMemo(() => {
		if (!selectedTerritoryId) return computeStats(globalPoints);
		return computeStats(applyFilters(pointsByTerritory[selectedTerritoryId] ?? [], localFilters));
	}, [selectedTerritoryId, globalPoints, pointsByTerritory, localFilters]);

	const demography = useMemo(
		() => (selectedTerritory ? fetchTerritoryDemography(selectedTerritory) : fetchCityDemography()),
		[selectedTerritory]
	);

	/**
	 * Черновик брика: пока инструмент активен, панель показывает не выбранное, а то, что
	 * получится. Прямоугольник и полигон дают замкнутый контур — по нему считается статистика;
	 * у лассо до отпускания кнопки и у разреза контура ещё нет, остаётся одно название.
	 */
	const draft: DraftTerritory | null = useMemo(() => {
		if (tool === "cursor" || tool === "merge") return null;
		const closed = tool === "square" || tool === "polygon";
		if (!closed || !draftGeometry?.length) {
			return {
				title: tool === "cut" ? "Разрез территории" : "Новый брик",
				stats: null,
				demography: null,
				hint:
					tool === "cut"
						? "Территория ещё не разделена: проведите линию через неё насквозь, и части станут бриками."
						: "Брик ещё не собран: закончите контур, и здесь появится его статистика."
			};
		}
		return {
			title: "Новый брик",
			stats: computeStats(pointsInGeometry(draftGeometry, globalPoints)),
			demography: draftDemography(draftGeometry),
			hint: "Брик ещё не создан — показаны данные нарисованной области."
		};
	}, [tool, draftGeometry, globalPoints]);

	const territoryRows: TerritoryListRow[] = useMemo(
		() =>
			[...visible]
				.sort((a, b) => {
					if (a.kind !== b.kind) return a.kind === "brick" ? -1 : 1;
					return a.name.localeCompare(b.name);
				})
				.map((t) => ({
					id: t.id,
					name: t.name,
					kindLabel: TERRITORY_KIND_LABEL[t.kind],
					color: colors[t.id] ?? "#cbd5e1",
					count: statsByTerritory[t.id]?.count ?? 0,
					turnover: statsByTerritory[t.id]?.turnover ?? 0
				})),
		[visible, colors, statsByTerritory]
	);

	/* ---------- операции нарезки ---------- */

	/** Короткое сообщение поверх карты — когда операция нарезки ничего не изменила. */
	const showNotice = (text: string) => {
		setNotice(text);
		window.clearTimeout(noticeTimer.current);
		noticeTimer.current = window.setTimeout(() => setNotice(null), 4000);
	};

	/** Любая операция нарезки сохраняет предыдущее состояние для отмены (треб. 2.3.8). */
	const commit = (next: Territory[]) => {
		if (next === bricks) return;
		setHistory((prev) => [...prev.slice(-19), bricks]);
		setBricks(next);
	};

	const handleUndo = () => {
		if (!history.length) return;
		setBricks(history[history.length - 1]);
		setHistory(history.slice(0, -1));
		setSelection(null);
	};

	const handleCreateBrick = (geometry: MultiPoly) => {
		const next = createBrick(bricks, geometry);
		if (next === bricks) {
			showNotice("Брик не создан: область не пересекается с территорией города");
			return;
		}
		commit(next);
		setSelection({ kind: "territory", id: next[next.length - 1].id });
	};

	const handleSplit = (targetId: string, corridor: MultiPoly) => {
		const next = splitTerritory(model, targetId, corridor);
		// Линия, не пересёкшая территорию насквозь, ничего не делит — говорим об этом явно.
		if (next === bricks) {
			showNotice("Линия не разделила территорию: проведите её через территорию насквозь");
			return;
		}
		commit(next);
		setSelection(null);
	};

	const handleMerge = (ids: string[]) => {
		const next = mergeTerritories(model, ids);
		if (next === bricks) {
			showNotice("Объединение не выполнено: выберите минимум две территории");
			return;
		}
		commit(next);
		setSelection({ kind: "territory", id: next[next.length - 1].id });
	};

	const handleUpdateBrick = (id: string, geometry: MultiPoly) =>
		commit(updateBrickGeometry(bricks, id, geometry));

	const handleRenameBrick = (id: string, name: string) => commit(renameBrick(bricks, id, name));

	const handleDeleteBrick = (id: string) => {
		commit(deleteBrick(bricks, id));
		setSelection(null);
	};

	/* ---------- фильтры из блоков статистики (треб. 5.5) ---------- */

	const handleToggleFilter = (dimension: FilterDimension, value: string) => {
		if (selectedTerritoryId) setLocalFilters((prev) => toggleFilterValue(prev, dimension, value));
		else setFilters((prev) => toggleFilterValue(prev, dimension, value));
	};

	const handleResetScopeFilters = () => {
		if (selectedTerritoryId) setLocalFilters(createDefaultFilters());
		else setFilters(createDefaultFilters());
	};

	/** Сместить карту к выбранному объекту. */
	const handleFocus = () => {
		setFocusRequest((prev) => {
			const nonce = (prev?.nonce ?? 0) + 1;
			if (selection?.kind === "point") {
				return { nonce, kind: "point", lat: selection.point.lat, lng: selection.point.lng };
			}
			if (selection?.kind === "territory") return { nonce, kind: "territory", id: selection.id };
			return prev;
		});
	};

	return (
		<div className="flex h-screen w-full flex-col">
			<FiltersBar
				filters={filters}
				onChange={setFilters}
				onReset={() => setFilters(createDefaultFilters())}
				shownCount={mapPoints.length}
				totalCount={TRADE_POINTS.length}
			/>
			{/*
			 * Пропорции карты и правой панели переживают перезагрузку (треб. 1.2):
			 * `autoSaveId` складывает раскладку в `localStorage`, панелям заданы явные id,
			 * чтобы сохранённое значение не сползло при изменении состава группы.
			 */}
			<ResizablePanelGroup
				direction="horizontal"
				autoSaveId="retail-heatmap:layout"
				className="min-h-0 w-full flex-1"
			>
				<ResizablePanel id="map" order={1}>
					<MapView
						visible={visible}
						effective={model.effective}
						colors={colors}
						points={mapPoints}
						selectedTerritoryId={selectedTerritoryId}
						selectedPointCode={selection?.kind === "point" ? selection.point.code : null}
						editing={editing}
						opacity={opacity}
						tool={tool}
						focusRequest={focusRequest}
						canUndo={history.length > 0}
						notice={notice}
						onToolChange={setTool}
						onUndo={handleUndo}
						onSelectPoint={(point) => setSelection({ kind: "point", point })}
						onSelectTerritory={(id) => setSelection({ kind: "territory", id })}
						onCreateBrick={handleCreateBrick}
						onSplitTerritory={handleSplit}
						onMergeTerritories={handleMerge}
						onUpdateBrick={handleUpdateBrick}
						onDraftChange={setDraftGeometry}
					>
						<Legend
							metric={metric}
							onMetricChange={setMetric}
							maxValue={maxMetricValue}
							layer={mapLayer}
							onLayerChange={setMapLayer}
							opacity={opacity}
							onOpacityChange={setOpacity}
						/>
					</MapView>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel id="panel" order={2} defaultSize={30} minSize={24} maxSize={40}>
					<RightPanel
						selection={selection}
						stats={panelStats}
						demography={demography}
						scopeFilters={selectedTerritoryId ? localFilters : filters}
						scopeIsLocal={Boolean(selectedTerritoryId)}
						territory={selectedTerritory}
						draft={draft}
						territoryRows={territoryRows}
						editing={editing}
						onToggleFilter={handleToggleFilter}
						onResetScopeFilters={handleResetScopeFilters}
						onClose={() => setSelection(null)}
						onSelectTerritory={(id) => setSelection({ kind: "territory", id })}
						onRenameBrick={handleRenameBrick}
						onDeleteBrick={handleDeleteBrick}
						onToggleEdit={() => setEditing((v) => !v)}
						onFocus={handleFocus}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
