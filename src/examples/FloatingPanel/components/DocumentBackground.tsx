import type { ReactNode } from "react";
import { ArrowRight, Cloud, FileText, LayoutTemplate } from "lucide-react";

const Link = ({ children }: { children: ReactNode }) => (
	<span className="cursor-default text-blue-600 hover:underline">{children}</span>
);

export const DocumentBackground = () => {
	return (
		<article className="absolute inset-0 overflow-y-auto bg-secondary-bg px-10 py-8 pb-32 [scrollbar-width:thin]">
			<div className="mx-auto flex max-w-2xl flex-col gap-6">
				<p className="text-sm text-muted">gramax-manifest</p>

				<h1 className="text-3xl font-bold tracking-tight text-primary-fg">
					What &ldquo;Invisible&rdquo; Means
				</h1>

				<blockquote className="flex gap-3 rounded-xl bg-secondary-bg px-4 py-3 text-sm leading-relaxed text-primary-fg">
					<span className="shrink-0 text-2xl leading-none text-muted" aria-hidden>
						&rdquo;&rdquo;
					</span>
					<p>Про принципы и философию «незаметного» дизайна</p>
				</blockquote>

				<p className="text-sm leading-relaxed text-primary-fg">
					If you need more than 2 minutes to process the email, you can postpone it. My trick is to
					&ldquo;Star&rdquo; an email so it shows up in my Starred folder, then once a day I process the
					Starred folder and get to Inbox Zero again.
				</p>

				<section className="flex flex-col gap-3">
					<h2 className="text-xl font-semibold text-primary-fg">Начало работы</h2>
					<ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-relaxed text-primary-fg marker:text-muted">
						<li>
							<Link>Создайте каталог.</Link>
						</li>
						<li>
							<Link>Опубликуйте каталог в хранилище.</Link>
						</li>
						<li>
							<Link>Разверните портал для читателей.</Link>
						</li>
						<li>Загрузите каталог на созданный портал.</li>
					</ol>
				</section>

				<section className="flex flex-col gap-3">
					<h2 className="text-xl font-semibold text-primary-fg">Компоненты</h2>
					<ol className="flex list-decimal flex-col gap-3 pl-5 text-sm leading-relaxed text-primary-fg marker:text-muted">
						<li>
							<Link>Приложение Gramax.</Link> Позволяет пользователям создавать каталоги и редактировать
							статьи. Есть браузерная и десктопная версия для Windows, Mac, Linux.
						</li>
						<li>
							<Link>Хранилище.</Link> С его помощью происходит синхронизация каталогов между
							пользователями. А также из хранилища информация публикуется на{" "}
							<Link>портал документации</Link>.
						</li>
						<li>
							<Link>Портал документации.</Link> Это сайт, на котором читатели могут просматривать
							опубликованные материалы.
						</li>
					</ol>
				</section>

				<div className="mt-2 flex items-stretch justify-between gap-3 rounded-xl border border-secondary-border bg-primary-bg p-5 shadow-soft-sm">
					{[
						{ title: "Приложение", icon: LayoutTemplate },
						{ title: "Git-хранилище", icon: Cloud },
						{ title: "Сайт документации", icon: FileText }
					].map(({ title, icon: Icon }, index, items) => (
						<div key={title} className="flex flex-1 items-center gap-3">
							<div className="flex flex-1 flex-col items-center gap-2">
								<p className="text-sm font-semibold text-primary-fg">{title}</p>
								<div className="flex h-24 w-full items-center justify-center rounded-lg border border-secondary-border bg-secondary-bg">
									<Icon className="size-8 text-muted" strokeWidth={1.5} />
								</div>
							</div>
							{index < items.length - 1 && (
								<ArrowRight className="size-5 shrink-0 self-center text-muted" />
							)}
						</div>
					))}
				</div>
			</div>
		</article>
	);
};
