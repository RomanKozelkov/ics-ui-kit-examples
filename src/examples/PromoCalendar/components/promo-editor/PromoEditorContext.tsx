import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { PromoCalendarItem } from "../../api/promo.types";

type EditorState =
	| { open: false; mode: "create"; promo: null }
	| { open: true; mode: "create"; promo: null }
	| { open: true; mode: "edit"; promo: PromoCalendarItem };

type PromoEditorApi = {
	open: boolean;
	mode: "create" | "edit";
	promo: PromoCalendarItem | null;
	openCreate: () => void;
	openEdit: (promo: PromoCalendarItem) => void;
	close: () => void;
};

const CLOSED: EditorState = { open: false, mode: "create", promo: null };

const PromoEditorContext = createContext<PromoEditorApi | null>(null);

/**
 * Открытие редактора спрятано за хуком — вызывающие (кнопка «Добавить», клик по бару) не знают,
 * что это React-модалка. В реальном проекте провайдер можно подменить на императивную JS-модалку,
 * не трогая call-site (см. план: единственный новый шов поверх уже абстрагированного PromoApi).
 */
export function PromoEditorProvider({ children }: PropsWithChildren) {
	const [state, setState] = useState<EditorState>(CLOSED);

	const openCreate = useCallback(() => setState({ open: true, mode: "create", promo: null }), []);
	const openEdit = useCallback((promo: PromoCalendarItem) => setState({ open: true, mode: "edit", promo }), []);
	const close = useCallback(() => setState(CLOSED), []);

	const value = useMemo<PromoEditorApi>(
		() => ({ open: state.open, mode: state.mode, promo: state.promo, openCreate, openEdit, close }),
		[state, openCreate, openEdit, close]
	);

	return <PromoEditorContext.Provider value={value}>{children}</PromoEditorContext.Provider>;
}

export function usePromoEditor(): PromoEditorApi {
	const ctx = useContext(PromoEditorContext);
	if (!ctx) throw new Error("usePromoEditor must be used within PromoEditorProvider");
	return ctx;
}
