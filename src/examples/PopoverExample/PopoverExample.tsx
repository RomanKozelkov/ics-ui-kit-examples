import { Button } from "ics-ui-kit/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "ics-ui-kit/components/popover";

/** Простой Popover: кнопка-триггер и текстовое содержимое. */
export function PopoverExample() {
	return (
		<div className="flex justify-center p-10">
			<Popover>
				<PopoverTrigger asChild>
					<Button>Открыть поповер</Button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="mb-1 text-sm font-semibold text-primary-fg">Заголовок</div>
					<p className="text-sm text-muted">
						Это содержимое поповера. Здесь может быть любой текст или другие компоненты.
					</p>
				</PopoverContent>
			</Popover>
		</div>
	);
}
