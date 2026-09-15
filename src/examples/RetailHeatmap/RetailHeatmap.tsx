import { useEffect, useMemo, useRef, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "ics-ui-kit/components/resizable";
import { draftDemography, fetchCityDemography, fetchTerritoryDemography } from "./api";
import { FiltersBar } from "./FiltersBar";
import { Legend } from "./Legend";
import { MapView, type FocusRequest, type MapLayer } from "./MapView";
import {
	EMPTY_SELECTION,
	ROOT_CRUMB_ID,
	RightPanel,
	type Crumb,
	type DraftTerritory,
	type Selection,
	type TerritoryListRow
} from "./RightPanel";
import type { Tool } from "./MapToolbar";
import { TRADE_POINTS } from "./mockData";
import { MOSCOW } from "./moscowGeo";
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
	const [selection, setSelection] = useState<Selection>(EMPTY_SELECTION);
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

	const selectedTerritoryId = selection.territoryId;

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

	/**
	 * Путь над заголовком панели. У выбранной точки он ведёт к её собственной территории:
	 * брик, если точка попала в брик, иначе округ → район. Сама выбранная территория в путь
	 * не входит, когда точка не выбрана, — она и так в заголовке строкой ниже.
	 *
	 * Брик начинается прямо от города: он нарезается поверх базового слоя и может не совпадать
	 * с границами района, поэтому подставлять его «родителя» в путь было бы неверно.
	 */
	const crumbs: Crumb[] = useMemo(() => {
		const point = selection.point;
		const anchor = point ? model.byId[model.pointTerritoryId[point.code] ?? ""] : selectedTerritory;
		if (!anchor && !point) return [];
		const list: Crumb[] = [{ id: ROOT_CRUMB_ID, label: MOSCOW.name }];
		if (anchor) {
			const parent = anchor.parentId ? model.byId[anchor.parentId] : undefined;
			if (parent && anchor.kind === "rayon") list.push({ id: parent.id, label: parent.name });
			if (point) list.push({ id: anchor.id, label: anchor.name });
		}
		return list;
	}, [model, selectedTerritory, selection.point]);

	/** Точка входит в выбранную территорию: у округа — через его районы. */
	const pointInSelection = (point: TradePoint): boolean => {
		if (!selectedTerritoryId) return false;
		const leafId = model.pointTerritoryId[point.code];
		if (!leafId) return false;
		return leafId === selectedTerritoryId || (model.childRayons[selectedTerritoryId]?.includes(leafId) ?? false);
	};

	/**
	 * Выбор точки. Если точка внутри выбранной территории — область разбора сохраняется, карта
	 * не «разворачивается» обратно ко всем точкам города. Иначе областью становится территория
	 * самой точки: брик, если точка в брике, иначе её район.
	 */
	const handleSelectPoint = (point: TradePoint) =>
		setSelection((prev) => ({
			territoryId: pointInSelection(point) ? prev.territoryId : model.pointTerritoryId[point.code] ?? null,
			point
		}));

	/**
	 * Смена инструмента. Начало нарезки сбрасывает выбор: рисовать брик нужно по всем точкам
	 * рабочей области, а выбранная территория оставляет на карте только свои.
	 */
	const handleToolChange = (next: Tool) => {
		setTool(next);
		if (next !== "cursor") setSelection(EMPTY_SELECTION);
	};

	/** «Назад»: из карточки точки — к её территории, с территории — ко всей рабочей области. */
	const handleBack = () =>
		setSelection((prev) =>
			prev.point && prev.territoryId ? { territoryId: prev.territoryId, point: null } : EMPTY_SELECTION
		);

	/**
	 * Переход по пути. Вместе с территорией переключается и слой карты: выбранный по пути округ
	 * или район иначе остался бы неотрисованным, если на карте показан другой уровень. Брики
	 * видны при любом слое, поэтому переход к брику слой не трогает.
	 */
	const handleSelectCrumb = (id: string) => {
		if (id === ROOT_CRUMB_ID) {
			setSelection(EMPTY_SELECTION);
			return;
		}
		setSelection({ territoryId: id, point: null });
		const kind = model.byId[id]?.kind;
		if (kind === "okrug" || kind === "rayon") setMapLayer(kind);
	};

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
		setSelection(EMPTY_SELECTION);
	};

	const handleCreateBrick = (geometry: MultiPoly) => {
		const next = createBrick(bricks, geometry);
		if (next === bricks) {
			showNotice("Брик не создан: область не пересекается с территорией города");
			return;
		}
		commit(next);
		setSelection({ territoryId: next[next.length - 1].id, point: null });
	};

	const handleSplit = (targetId: string, corridor: MultiPoly) => {
		const next = splitTerritory(model, targetId, corridor);
		// Линия, не пересёкшая территорию насквозь, ничего не делит — говорим об этом явно.
		if (next === bricks) {
			showNotice("Линия не разделила территорию: проведите её через территорию насквозь");
			return;
		}
		commit(next);
		setSelection(EMPTY_SELECTION);
	};

	const handleMerge = (ids: string[]) => {
		const next = mergeTerritories(model, ids);
		if (next === bricks) {
			showNotice("Объединение не выполнено: выберите минимум две территории");
			return;
		}
		commit(next);
		setSelection({ territoryId: next[next.length - 1].id, point: null });
	};

	const handleUpdateBrick = (id: string, geometry: MultiPoly) =>
		commit(updateBrickGeometry(bricks, id, geometry));

	const handleRenameBrick = (id: string, name: string) => commit(renameBrick(bricks, id, name));

	const handleDeleteBrick = (id: string) => {
		commit(deleteBrick(bricks, id));
		setSelection(EMPTY_SELECTION);
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
			if (selection.point) {
				return { nonce, kind: "point", lat: selection.point.lat, lng: selection.point.lng };
			}
			if (selection.territoryId) return { nonce, kind: "territory", id: selection.territoryId };
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
						selectedPointCode={selection.point?.code ?? null}
						editing={editing}
						opacity={opacity}
						tool={tool}
						focusRequest={focusRequest}
						canUndo={history.length > 0}
						notice={notice}
						onToolChange={handleToolChange}
						onUndo={handleUndo}
						onSelectPoint={handleSelectPoint}
						onSelectTerritory={(id) => setSelection({ territoryId: id, point: null })}
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
						crumbs={crumbs}
						draft={draft}
						territoryRows={territoryRows}
						editing={editing}
						onToggleFilter={handleToggleFilter}
						onResetScopeFilters={handleResetScopeFilters}
						onClose={handleBack}
						onSelectCrumb={handleSelectCrumb}
						onSelectTerritory={(id) => setSelection({ territoryId: id, point: null })}
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
