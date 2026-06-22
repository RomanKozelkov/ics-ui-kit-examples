import { Button } from "ics-ui-kit/components/button";
import { Plus } from "lucide-react";
import { useText } from "../../../i18n";
import { usePromoEditor } from "../../promo-editor/PromoEditorContext";

export function AddPromoButton() {
	const { openCreate } = usePromoEditor();
	const text = useText();

	return (
		<Button variant="primary" startIcon={Plus} onClick={openCreate}>
			{text("panel.add")}
		</Button>
	);
}
