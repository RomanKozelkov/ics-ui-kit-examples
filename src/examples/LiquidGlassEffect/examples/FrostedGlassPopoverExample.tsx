import { Popover, PopoverContent, PopoverTrigger } from "ics-ui-kit/components/popover";
import { Button } from "ics-ui-kit/components/button";
import { Bell } from "lucide-react";

const HEADER_HEIGHT = 42;

const NOTIFICATIONS = [
	{ initials: "NK", name: "Никита Страпилов", time: "1 час назад", unread: true, text: "Добавил обработчик событий в компонент dropdown." },
	{ initials: "AK", name: "Александр Курбатов", time: "вчера", unread: true, text: "Обновил три файла в sidebar-navigation." },
	{ initials: "SP", name: "Станислав Перемычкин", time: "1 день назад", unread: true, text: "Создал pull request для компонента Calendar." },
	{ initials: "KB", name: "Константин Бородинский", time: "11 месяцев назад", unread: false, text: "Рефакторинг компонента Button." },
	{ initials: "BV", name: "Борислав Вронский", time: "1 год назад", unread: false, text: "Добавил обработчик событий в dropdown, обновил 3 файла." },
	{ initials: "NS", name: "Николай Сорокин", time: "2 года назад", unread: false, text: "Рефакторинг компонента навигации в боковой панели." },
];

const frostedHeaderStyle = {
	backdropFilter: "blur(12px) saturate(180%)",
	WebkitBackdropFilter: "blur(12px) saturate(180%)",
	background: "rgba(255,255,255,0.12)",
	borderBottom: "1px solid rgba(255,255,255,0.15)",
} as React.CSSProperties;

export function FrostedGlassPopoverExample() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="secondary" className="w-52 gap-2">
					<Bell className="size-4" />
					Уведомления
				</Button>
			</PopoverTrigger>

			<PopoverContent className="relative w-80 overflow-hidden p-0">
				<div
					style={{ ...frostedHeaderStyle, height: HEADER_HEIGHT, zIndex: 10 }}
					className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between px-4"
				>
					<span className="pointer-events-auto text-base font-semibold text-primary-fg">Уведомления</span>
					<Button size="xs" variant="text" className="pointer-events-auto h-[22px] px-0 pb-0.5 pt-1 text-xs text-secondary-fg">
						Прочитать все
					</Button>
				</div>

				<div className="flex flex-col" style={{ maxHeight: 360, overflowY: "auto", scrollbarWidth: "none" }}>
					<div className="flex flex-col gap-1 px-1 pb-1" style={{ paddingTop: HEADER_HEIGHT + 4 }}>
						{NOTIFICATIONS.map((n) => (
							<div key={n.name} className="flex flex-row gap-3 rounded-lg px-3 py-2 hover:bg-primary-fg/5">
								<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-xs font-semibold text-white">
									{n.initials}
								</div>
								<div className="flex w-full flex-col gap-0.5">
									<div className="relative flex flex-row items-baseline gap-2">
										<span className="text-sm font-medium leading-5 text-primary-fg">{n.name}</span>
										<span className="text-xs text-secondary-fg">{n.time}</span>
										{n.unread && <span className="absolute right-0 top-1 size-1.5 rounded-full bg-red-500" />}
									</div>
									<span className="text-xs text-secondary-fg">{n.text}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
