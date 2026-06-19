import { useMemo } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from "ics-ui-kit/components/dialog";
import type { PromoCalendarItem } from "../../api/promo.types";
import {
	useCreatePromoMutation,
	useDeletePromoMutation,
	useUpdatePromoMutation
} from "../../api/promo.queries";
import { useText } from "../../i18n";
import { usePanelStore } from "../management-panel/store/panel.store";
import { usePromoEditor } from "./PromoEditorContext";
import { PromoForm } from "./PromoForm";
import { makeRandomPromoDraft } from "./constants";

type PromoFormValues = Omit<PromoCalendarItem, "id">;

const toFormValues = (promo: PromoCalendarItem): PromoFormValues => {
	const { id: _id, ...rest } = promo;
	return rest;
};

/**
 * Единственная точка монтирования редактора. Состояние открытия/режима держит PromoEditorContext,
 * персистентность — мутации поверх порта PromoApi. defaultValues пересчитываются на каждое
 * открытие; key на форме (см. ниже) сбрасывает её локальный useState.
 */
export function PromoEditorDialog() {
	const text = useText();
	const year = usePanelStore((s) => s.year);
	const { open, mode, promo, close } = usePromoEditor();

	const create = useCreatePromoMutation({ year });
	const update = useUpdatePromoMutation({ year });
	const remove = useDeletePromoMutation({ year });
	const pending = create.isPending || update.isPending || remove.isPending;

	// create → новый рандомный черновик; edit → значения промо. Считаем при открытии.
	const defaultValues = useMemo<PromoFormValues>(
		() => (mode === "edit" && promo ? toFormValues(promo) : makeRandomPromoDraft(year)),
		[mode, promo, year]
	);

	const handleSave = (values: PromoFormValues) => {
		if (mode === "edit" && promo) {
			update.mutate({ ...values, id: promo.id });
		} else {
			create.mutate(values);
		}
		close();
	};

	const handleDelete = () => {
		if (promo) remove.mutate(promo.id);
		close();
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !next && close()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{text(mode === "edit" ? "editor.editTitle" : "editor.createTitle")}</DialogTitle>
				</DialogHeader>
				<PromoForm
					key={mode === "edit" && promo ? promo.id : "create"}
					mode={mode}
					pending={pending}
					defaultValues={defaultValues}
					onSave={handleSave}
					onDelete={mode === "edit" ? handleDelete : undefined}
					onCancel={close}
				/>
			</DialogContent>
		</Dialog>
	);
}
