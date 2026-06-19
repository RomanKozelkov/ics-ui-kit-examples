import { useEffect, useRef, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "ics-ui-kit/components/resizable";
import { MapView, type FocusRequest } from "./MapView";
import { RightPanel, type Selection } from "./RightPanel";
import { INITIAL_BRICKS, colorize, makeBrick, type Brick } from "./bricks";

/**
 * OPL-145 — Тепловая карта на бриках с торговыми точками.
 *
 * Карта (слева) + правая панель (справа), разделитель — Resizable из ics-ui-kit.
 * Клик по точке/брику выбирает его; инструменты Квадрат/Лассо/Полигон создают новые брики.
 */
export function RetailHeatmap() {
	const [bricks, setBricks] = useState<Brick[]>(INITIAL_BRICKS);
	const [selection, setSelection] = useState<Selection>(null);
	const [editing, setEditing] = useState(false);
	const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);
	const seqRef = useRef(INITIAL_BRICKS.length);
	const selectedBrickId = selection?.kind === "brick" ? selection.id : null;

	// Сбрасываем режим правки при любой смене выбранного брика (в т.ч. при удалении/закрытии).
	useEffect(() => {
		setEditing(false);
	}, [selectedBrickId]);

	const handleCreateBrick = (latlngs: [number, number][]) => {
		const seq = ++seqRef.current;
		const id = "b" + seq;
		setBricks((prev) => colorize([...prev, makeBrick(id, "Брик " + seq, latlngs)]));
		setSelection({ kind: "brick", id });
	};

	const handleDeleteBrick = (id: string) => {
		setBricks((prev) => colorize(prev.filter((b) => b.id !== id)));
		setSelection(null);
	};

	const handleUpdateBrick = (id: string, latlngs: [number, number][]) => {
		setBricks((prev) =>
			colorize(prev.map((b) => (b.id === id ? makeBrick(b.id, b.name, latlngs) : b)))
		);
	};

	// Сместить карту к текущему выбранному объекту (точке или брику).
	const handleFocus = () => {
		setFocusRequest((prev) => {
			const nonce = (prev?.nonce ?? 0) + 1;
			if (selection?.kind === "point") {
				return { nonce, kind: "point", lat: selection.point.lat, lng: selection.point.lng };
			}
			if (selection?.kind === "brick") {
				return { nonce, kind: "brick", id: selection.id };
			}
			return prev;
		});
	};

	return (
		<div className="h-screen w-full">
			<ResizablePanelGroup direction="horizontal" className="h-full w-full">
				<ResizablePanel>
					<MapView
						bricks={bricks}
						selectedBrickId={selectedBrickId}
						editing={editing}
						focusRequest={focusRequest}
						onSelectPoint={(point) => setSelection({ kind: "point", point })}
						onSelectBrick={(id) => setSelection({ kind: "brick", id })}
						onCreateBrick={handleCreateBrick}
						onUpdateBrick={handleUpdateBrick}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={30} minSize={24} maxSize={40}>
					<RightPanel
						selection={selection}
						bricks={bricks}
						editing={editing}
						onClose={() => setSelection(null)}
						onSelectBrick={(id) => setSelection({ kind: "brick", id })}
						onDeleteBrick={handleDeleteBrick}
						onToggleEdit={() => setEditing((v) => !v)}
						onFocus={handleFocus}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
