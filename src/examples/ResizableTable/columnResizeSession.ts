/**
 * Скопировано почти без изменений из MDT (с пометкой, не импорт):
 * ui/_core/scripts/views/list/features/columnResize/ResizeSession.ts
 *
 * Чистый DOM/framework-agnostic класс — держит состояние одной drag-сессии
 * ресайза и считает новую ширину по формуле MDT: clamp(minWidth, startWidth + dx).
 * Используется в VanillaResizableTable вместе с прямой мутацией стилей DOM — без React state на каждый mousemove.
 */
interface ResizeSessionState {
	columnKey: string;
	startWidth: number;
	startX: number;
}

export class ColumnResizeSession {
	private state?: ResizeSessionState;

	constructor(private minWidth: number) {}

	start(columnKey: string, startWidth: number, startX: number) {
		this.state = { columnKey, startWidth, startX };
	}

	getWidth(currentX: number) {
		if (!this.state) return;
		return Math.max(this.minWidth, this.state.startWidth + currentX - this.state.startX);
	}

	getColumnKey() {
		return this.state?.columnKey;
	}

	end() {
		this.state = undefined;
	}
}
