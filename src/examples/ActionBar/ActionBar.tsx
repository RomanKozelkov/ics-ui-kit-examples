import { Download, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { DashboardCard } from "../../shared/components/DashboardCard";
import { ActionBarComponent } from "./components/ActionBarComponent";

const ICONS = [Plus, Pencil, Trash2, Download, Upload] as const;
const LABELS = ["Добавить", "Редактировать", "Удалить", "Экспорт", "Импорт"];

export function ActionBar() {
	const items = LABELS.map((label, i) => {
		const Icon = ICONS[i];
		return {
			id: label,
			label,
			icon: Icon
		};
	});

	return (
		<div className="p-6">
			<DashboardCard title="ActionBar" subtitle="Потяните за уголок справа снизу, чтобы увидеть overflow.">
				<div
					className="max-w-full resize-x overflow-hidden rounded-lg border border-secondary-border p-3"
					style={{ width: 600 }}
				>
					<ActionBarComponent title="Управление позициями сотрудников" items={items} />
				</div>
			</DashboardCard>
		</div>
	);
}
