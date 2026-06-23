import * as React from "react";

function BgSection({ image, children }: { image: string; children: React.ReactNode }) {
	const [failed, setFailed] = React.useState(false);
	return (
		<div
			className="relative h-[340px] shrink-0 bg-gray-800 bg-cover bg-center"
			style={failed ? undefined : { backgroundImage: `url(${image})` }}
		>
			<img src={image} alt="" className="hidden" onError={() => setFailed(true)} />
			{failed && (
				<div className="absolute inset-0 flex items-center justify-center">
					<p className="text-xs text-white/40">Включите VPN для загрузки изображений</p>
				</div>
			)}
			{children}
		</div>
	);
}

const BG_SECTIONS = [
	{
		image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
		title: "Горы на рассвете",
		desc: "Швейцарские Альпы, 4 478 м",
		tag: "Природа"
	},
	{
		image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
		title: "Ночной город",
		desc: "Огни мегаполиса с высоты",
		tag: "Урбанистика"
	},
	{
		image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
		title: "Северное сияние",
		desc: "Исландия, февраль",
		tag: "Атмосфера"
	},
	{
		image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80",
		title: "Закат над городом",
		desc: "Золотой час, тёплые тона",
		tag: "Закат"
	},
	{
		image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
		title: "Океанский берег",
		desc: "Лазурная вода, белый песок",
		tag: "Пляж"
	}
];

const TEXT_BLOCKS = [
	{
		heading: "Оптические эффекты",
		body: "backdrop-filter позволяет применять графические фильтры к области, находящейся за элементом, а не к самому элементу. Именно это создаёт эффект матового стекла — подложка размывается, а контент поверх остаётся чётким. Эффект широко используется в iOS, macOS и современных веб-интерфейсах как замена непрозрачным оверлеям."
	},
	{
		heading: "Производительность",
		body: "blur() — самый вычислительно тяжёлый из доступных фильтров. Браузер вынужден сэмплировать пиксели вокруг каждой точки, что растёт квадратично с радиусом размытия. На мобильных устройствах рекомендуется ограничивать значение 10–12px, избегать анимации blur и не применять эффект к большим областям экрана одновременно. Для критичных путей рассмотрите will-change: backdrop-filter."
	},
	{
		heading: "Поддержка браузеров",
		body: "backdrop-filter поддерживается во всех современных браузерах: Chrome 76+, Firefox 103+, Safari 9+ и Edge 17+. В Safari исторически требовался префикс -webkit-backdrop-filter — сейчас он опциональный, но его добавление гарантирует работу на старых версиях iOS. В Firefox поддержка долгое время была скрыта за флагом, но с версии 103 включена по умолчанию."
	},
	{
		heading: "Сочетание фильтров",
		body: "Несколько функций можно перечислять через пробел в одном свойстве: backdrop-filter: blur(12px) brightness(110%) saturate(180%). Порядок имеет значение — каждый следующий фильтр применяется к результату предыдущего. Например, contrast() после saturate() даст другой результат, чем saturate() после contrast(). Экспериментируйте с порядком, чтобы получить нужный визуальный эффект."
	}
];

export function GlassBackground({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative h-full min-h-[400px] overflow-hidden rounded-2xl bg-gray-900">
			<div className="absolute inset-0 overflow-y-auto px-40 py-20" style={{ scrollbarWidth: "none" }}>
				<div className="flex flex-col">
					{BG_SECTIONS.map((s, i) => (
						<React.Fragment key={s.title}>
							<BgSection image={s.image}>
								<div className="absolute inset-0 bg-black/10" />
								<div className="absolute bottom-4 left-6 flex flex-col gap-1">
									<span className="w-fit rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
										{s.tag}
									</span>
									<p className="text-base font-bold text-white drop-shadow">{s.title}</p>
									<p className="text-xs text-white/70">{s.desc}</p>
								</div>
							</BgSection>
							{i < TEXT_BLOCKS.length && (
								<div className="bg-gray-900 px-8 py-8">
									<p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-white/40">
										{TEXT_BLOCKS[i].heading}
									</p>
									<p className="text-sm leading-relaxed text-white/70">{TEXT_BLOCKS[i].body}</p>
								</div>
							)}
						</React.Fragment>
					))}
				</div>
			</div>
			{children}
		</div>
	);
}
