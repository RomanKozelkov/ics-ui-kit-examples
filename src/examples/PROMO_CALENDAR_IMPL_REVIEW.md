# Промо-календарь: разбор **реализации** обоих прототипов

Не «что умеет библиотека», а **как написан код**: легко ли далась каждая фича, насколько кастомизируемо, насколько эффективно. Отдельно — выдержат ли оба 10k записей от API.

- RCT = `src/examples/promo-calendar-react-calendar-timeline` (`react-calendar-timeline@0.30.0-beta.18`)
- dnd = `src/examples/promo-calendar-dnd` (`dnd-timeline@3.1.1`)

---

## Общий слой (идентичен в обоих)

Data-слой совпадает дословно: `api/promo.queries.ts`, `promo.mock.ts`, `date.ts`, `palette.ts`. Различается только то, что внутри `promo-calendar/`.

Подготовка данных в обоих — чистый `useMemo`, алгоритмически дешёвая:
- RCT: `useTimelineData` — O(n) prep + O(n) групп ([useTimelineData.ts](promo-calendar-react-calendar-timeline/components/promo-calendar/hooks/useTimelineData.ts))
- dnd: `useGroupedRows` → `buildGroupTree` O(n·depth) + `assignLanes` O(n log n) на группу ([grouping.ts](promo-calendar-dnd/components/promo-calendar/utils/grouping.ts))

Математика раскладки в обоих не является узким местом. Узкое место — **DOM и оверхед фреймворка** (см. раздел 10k).

### Общий архитектурный изъян — Tooltip на каждую полоску

В обоих каждая полоска оборачивается в **собственный** Radix-`Tooltip` (+ `TooltipProvider` в RCT):
- RCT: `PromoItemRenderer.tsx:28` — `TooltipProvider` внутри рендера каждого item
- dnd: `PromoItem.tsx:25` — `Tooltip` на каждый item

На 100 записях незаметно. На 10k это 10k контекст-провайдеров Radix → дорогой mount, память, реконсиляция. **Фикс одинаковый для обоих:** один `TooltipProvider` на корень + единый ленивый тултип, наполняемый по `hover` (data-атрибуты на полоске). Изъян не библиотечный — архитектурный, в обоих прототипах.

---

## Пофичный разбор: как далось / кастомизируемость / эффективность

### 1. Двухуровневая шапка (месяц / день)
- **RCT:** объявление, не код. Два `<DateHeader>` + `<SidebarHeader>` ([PromoCalendar.tsx:143-160](promo-calendar-react-calendar-timeline/components/promo-calendar/PromoCalendar.tsx)). Позиционирование, sticky, синхрон со скроллом — внутри либы.
  - Кастомизируемость: средняя. Лейбл — через `labelFormat`/`intervalRenderer`. 3-й уровень — ещё `<DateHeader>`, но только из единиц, которые знает либа.
  - Эффективность: ✅ шапка часть канвы либы, не перерисовывается на горизонтальный скролл.
- **dnd:** свой `TimelineHeader` — два абсолютных ряда через `valueToPixels` ([TimelineHeader.tsx](promo-calendar-dnd/components/promo-calendar/ui/TimelineHeader.tsx)).
  - Кастомизируемость: ✅ полная. Любой ярус = ещё один flex-ряд, любой формат.
  - Эффективность: ✅ `sticky top-0`, на горизонтальный скролл не ререндерится; перерасчёт только на zoom (изменение range).
- **Итог:** RCT — меньше кода; dnd — выше потолок. Оба эффективны.

### 2. Адаптивная плотность дней (номер / засечка)
- **RCT:** `intervalRenderer` + `interval.labelWidth >= DAY_NUMBER_MIN_PX` ([PromoCalendar.tsx:93-115](promo-calendar-react-calendar-timeline/components/promo-calendar/PromoCalendar.tsx)). Порог даёт сама либа.
- **dnd:** свой расчёт `dayPx = valueToPixels(MS_DAY); showDayNumbers = dayPx >= DAY_NUMBER_MIN_PX` ([TimelineHeader.tsx:26-27](promo-calendar-dnd/components/promo-calendar/ui/TimelineHeader.tsx)).
- **Итог:** паритет, обе по нескольку строк.

### 3. Многоуровневая группировка ⭐ решающее различие
- **RCT:** ❌ архитектурно не поддержано. Модель `groups` плоская → в коде сделан **ровно один уровень**: `groupBy: GroupField | null` ([useTimelineData.ts:44-74](promo-calendar-react-calendar-timeline/components/promo-calendar/hooks/useTimelineData.ts)), на странице — radio-выбор одного поля ([PromoCalendarPage.tsx:13](promo-calendar-react-calendar-timeline/PromoCalendarPage.tsx), `useState<GroupField | null>`).
  - Чтобы получить Канал→Бренд: пришлось бы флатить дерево в плоский список «псевдогрупп» с отступами и руками прятать дочерние строки при сворачивании. То есть писать ту же древовидную логику, что у dnd, **поверх** ограничений либы. Выигрыш «из коробки» при этом тает.
- **dnd:** ✅ нативно. `buildGroupTree` рекурсивный, N уровней; на странице — мультивыбор полей с порядком (`groupBy: GroupField[]`, бейджи `#1/#2`) ([PromoCalendarPage.tsx:13-16, 41-43](promo-calendar-dnd/PromoCalendarPage.tsx)).
  - Кастомизируемость: ✅ глубина и поля произвольны, рендер секции рекурсивный ([GroupSection.tsx](promo-calendar-dnd/components/promo-calendar/ui/GroupSection.tsx)).
- **Итог:** для `task.md` (Канал/Клиент/Бренд) **dnd выигрывает по делу**, а не по удобству. RCT-реализация эту фичу не закрывает вообще.

### 4. Сворачивание групп
- **RCT:** эмуляция. При сворачивании item'ы группы выкидываются из массива + высота строки ужимается до `SECTION_HEAD_H` ([useTimelineData.ts:62-72, 78-95](promo-calendar-react-calendar-timeline/components/promo-calendar/hooks/useTimelineData.ts)). Работает на одном уровне; на вложенном усложняется.
  - Эффективность: ✅ сворачивание **уменьшает** число DOM-нод (item'ы реально не рендерятся).
- **dnd:** `collapsedPaths: Set<string>`, рекурсивный `GroupSection` просто не рендерит детей ([GroupSection.tsx:24-39](promo-calendar-dnd/components/promo-calendar/ui/GroupSection.tsx)).
  - Кастомизируемость: ✅ любой уровень, путь как ключ.
- **Итог:** dnd чище и масштабируется на глубину; RCT — рабочий хак на один уровень.

### 5. Стек непересекающихся полос («выше та, что раньше»)
- **RCT:** ✅✅ **даром** — проп `stackItems` ([PromoCalendar.tsx:132](promo-calendar-react-calendar-timeline/components/promo-calendar/PromoCalendar.tsx)). Lane-логику не пишешь.
- **dnd:** свой `assignLanes` — greedy interval partitioning ([grouping.ts:63-78](promo-calendar-dnd/components/promo-calendar/utils/grouping.ts)). Написан, корректный, O(n log n).
- **Итог:** единственная фича, где RCT **меньше кода по существу**. Но цена — потеря контроля над раскладкой (в dnd её легко докрутить).

### 6. Полоска + тултип + обрезка по краям года
- Рендер полоски в обоих — **свой React** (Tailwind), не CSS либы: RCT через `itemRenderer` ([PromoItemRenderer.tsx](promo-calendar-react-calendar-timeline/components/promo-calendar/ui/PromoItemRenderer.tsx)), dnd напрямую ([PromoItem.tsx](promo-calendar-dnd/components/promo-calendar/ui/PromoItem.tsx)). Контент, ellipsis, `/ дней`, стрелки `‹ ›` на обрезке, скругление углов по `overflowLeft/Right` — идентичны.
- Обрезка по году: клампится в prep (RCT `useTimelineData.ts:29-37`, dnd `PromoItem.tsx:14-15` + prep).
- **Заусенец RCT по типам:** `ItemRendererProps` либа **наружу не экспортирует** — тип пере-объявлен руками ([PromoItemRenderer.tsx:6-11](promo-calendar-react-calendar-timeline/components/promo-calendar/ui/PromoItemRenderer.tsx)). У dnd `useItem` типизирован из коробки.
- **Итог:** контент-кастомизация в обоих полная; у RCT шероховатость типов.

### 7. Сетка / выходные / today-линия
- **RCT:** выходные — `verticalLineClassNamesForTime` → CSS-класс на `.rct-vl`; today — `<TodayMarker>` из коробки ([PromoCalendar.tsx:84-90, 161-165](promo-calendar-react-calendar-timeline/components/promo-calendar/PromoCalendar.tsx)). Заливка/линии настраиваются **только через CSS** (`styles.css`).
- **dnd:** свой `GridBackground` — рендерит дивы только для выходных и понедельников (остальные `return null`), today — свой див ([GridBackground.tsx:22-50](promo-calendar-dnd/components/promo-calendar/ui/GridBackground.tsx)).
  - Тонкая эффективность: dnd рисует фон **только по нужным дням** (≈выходные+пн ≈ 150 нод/год), RCT через `.rct-vertical-lines` держит ноду на **каждый** день.
- **Итог:** dnd экономнее по фоновым нодам и весь на Tailwind; RCT требует CSS-переопределений.

### 8. Стилизация в целом
- **RCT:** гибрид. Каркас либы — **только** через переопределение `.rct-*` с `!important` ([styles.css](promo-calendar-react-calendar-timeline/components/promo-calendar/styles.css): `.rct-sidebar`, `.rct-dateHeader`, `.rct-item {background:transparent!important}` и т.д.) + грузится `react-calendar-timeline/style.css`. Контент (полоски/группы) — Tailwind.
- **dnd:** ✅ чистый Tailwind, чужого CSS ноль. Либа отдаёт только позиционные inline-стили.
- **Итог:** dnd кастомизируется без борьбы с каскадом; RCT всегда тащит свой CSS-слой.

### 9. Клики по элементам
- **RCT:** конфликта нет (`canMove/canResize/canSelect={false}` — `PromoCalendar.tsx:133-136`). `onItemClick` навешивается тривиально.
- **dnd:** drag активен (`useItem` делает полоску draggable), значит клик надо отделять от драга — нужен activation constraint у сенсора `@dnd-kit` (distance ~5px). Сейчас в прототипе не выставлен → одиночный клик рискует уехать в drag.
- **Итог:** для чистого дисплея RCT удобнее; для dnd — известная мелкая доработка.

### 10. Добавить / удалить 1 элемент
- **RCT:** меняешь массив `items` → либа reconcile + `stackItems` пере-раскладывает группу. Дёшево на единичной операции.
- **dnd:** меняешь state → memo `useGroupedRows` → пере-`assignLanes` затронутой ветки → reconcile. dnd уже держит механику изменений через `overrides` (drag меняет даты — `PromoCalendar.tsx:34-45, 87-93`).
- **Итог:** обе дёшевы на единичной операции. На больших данных упрётся не add/remove, а полный рендер (ниже).

---

## ⚡ Виртуализация и 10k записей от API

Короткий ответ: **сейчас НИ ОДИН из прототипов 10k не держит.** Ни в одном нет виртуализации. Mock уже умеет столько (`generatePromos(count)` — [promo.mock.ts:238-241](promo-calendar-dnd/api/promo.mock.ts)), так что проверяемо.

### Почему упадут (оценка DOM/оверхеда на ~10k)

**RCT:**
- Рендерит **все** item'ы как абсолютные дивы, плюс по ноде на **каждый** день в `.rct-vertical-lines`, плюс горизонтальные линии на каждую строку. Со `stackItems` число строк растёт за счёт lane'ов.
- Каждый item = `TooltipProvider`+`Tooltip`+триггер+внутренние спаны ≈ 5-6 нод × 10k ≈ **50-60k нод** + 10k Radix-провайдеров.
- Главное: компонент **не headless** → точки внедрить оконный рендер нет. Тупик без форка либы.

**dnd:**
- Каждый item вызывает `useItem` → регистрирует draggable в `DndContext` ([PromoItem.tsx:17](promo-calendar-dnd/components/promo-calendar/ui/PromoItem.tsx)); каждый lane — `useRow` → droppable. `@dnd-kit` на старте драга **измеряет прямоугольники всех droppable**. 10k draggable — известная боль `@dnd-kit` (деградация уже на тысячах).
- Плюс: смена `range` (zoom) → меняется `valueToPixels` → **перерисовка всех 10k** item'ов разом ([PromoCalendar.tsx:49, 84](promo-calendar-dnd/components/promo-calendar/PromoCalendar.tsx)). На zoom — фриз.
- Тот же оверхед 10k Radix-тултипов.
- **Вывод: как написано сейчас, dnd на 10k даже тяжелее RCT** — из-за регистрации каждого узла в `@dnd-kit` и полного ререндера на zoom.

> Уточнение по скроллу: **горизонтальный скролл** в обоих дешёвый (RCT двигает канву; dnd скроллит нативно, item'ы позиционированы в пикселях и не ререндерятся). Дорого — **mount 10k** и в dnd ещё **zoom**.

### Кого реально можно дотянуть до 10k

| | Можно виртуализировать? | Как | Цена |
|---|---|---|---|
| **RCT** | ❌ практически нет | компонент не headless, оконный рендер не вставить | форк/смена либы |
| **dnd** | ✅ да | `groups.map(...)` твой → обернуть `@tanstack/react-virtual` (офиц. пример есть) | переменная высота строк (заголовки+lanes+сворачивание), sticky-группы, drag через границу окна — заметная работа, но реально |

**Вердикт по 10k:** только **dnd** архитектурно дотягивается до 10k — потому что headless, ты владеешь списком строк и можешь воткнуть windowing. RCT для 10k — тупик (нет точки внедрения виртуализации). Но в обоих сначала надо убрать общий изъян: **10k Radix-тултипов → один общий тултип**, иначе виртуализация строк не спасёт от стоимости провайдеров.

Доп. меры для dnd-пути на 10k:
1. Виртуализация строк `@tanstack/react-virtual` (только видимые lanes/заголовки).
2. Один общий `TooltipProvider` + ленивый контент по hover.
3. Drag-сенсор только на видимых строках; activation distance (заодно чинит click-vs-drag).
4. На zoom — не пересчитывать невидимое (range-перерасчёт ограничить окном).

### Рецепт виртуализации dnd-timeline (`@tanstack/react-virtual`)

Подтверждено по пакету: `valueToPixels` / `pixelsToValue` / `useRow` экспортируются из `dnd-timeline` — всего достаточно. README прямо рекомендует `react-virtual` как компаньон; в офиц. Storybook есть стори **Performance/Virtual**.

Идея: **виртуализируем только вертикаль** (строки: заголовки групп + lanes). Горизонталь не трогаем — полоски и так позиционированы абсолютно через `valueToPixels`, нативный горизонтальный скролл их не ререндерит.

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

// 1. flatten дерева групп в плоский список строк (с учётом collapsedPaths)
//    row = { kind: "group", node, depth } | { kind: "lane", rowId, items }
const flatRows = useMemo(() => flatten(groups, collapsedPaths), [groups, collapsedPaths]);

// 2. виртуализатор по вертикали
const parentRef = useRef<HTMLDivElement>(null);
const rowVirtualizer = useVirtualizer({
  count: flatRows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: (i) => (flatRows[i].kind === "group" ? GROUP_HEAD_H : LANE_H), // переменная высота
  overscan: 8,
});

// 3. рендерим ТОЛЬКО видимые строки — useRow/useItem живут лишь на них
<div ref={parentRef} className="overflow-auto">
  <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
    {rowVirtualizer.getVirtualItems().map((vr) => {
      const row = flatRows[vr.index];
      return (
        <div
          key={vr.key}
          style={{ position: "absolute", top: 0, width: "100%", height: vr.size, transform: `translateY(${vr.start}px)` }}
        >
          {row.kind === "group"
            ? <GroupHeaderRow group={row.node} depth={row.depth} .../>
            : <LaneRow rowId={row.rowId} items={row.items} .../>}
        </div>
      );
    })}
  </div>
</div>
```

Почему это снимает боль dnd: `useItem`/`useRow` вызываются **только на видимых** строках → `@dnd-kit` регистрирует ~десятки узлов вместо 10k. Главный источник деградации устранён.

Подводные камни (все решаемы):
- **Переменная высота** (заголовок vs lane) — `estimateSize` + `measureElement`, если высоты «плавают».
- **Drag через границу окна** — drop-цель может быть не смонтирована при оверскролле → `overscan` побольше + автоскролл `@dnd-kit` (`AutoScroll`).
- **Sticky-заголовки групп** — отдельный «прилипающий» виртуальный ряд.
- **Тултип сначала вынести в общий провайдер** — иначе виртуализация строк не спасёт от стоимости 10k Radix-провайдеров.

Объём: ~один хук + функция `flatten`. Это и есть главный аргумент «dnd дотягивается до 10k».

---

## Третья опция: `vis-timeline` (vis.js)

Запрос «vis-timeline — те же проблемы + сверху нет React-обёртки?» — **нет, картина другая.** Это другой компромисс, местами лучше по перформансу, но с реальной ценой в React-интеграции. (Прототипа в репо нет — оценка по архитектуре либы.)

**Где vis-timeline ЛУЧШЕ под 10k:**
- ✅ **Встроенный time-windowing** — рендерит в DOM только элементы текущего видимого окна времени, а не все 10k сразу. Из коробки то, что RCT/dnd сейчас не умеют.
- ✅ **Нативные вложенные группы** (`nestedGroups`) — то, чего RCT нет вовсе.
- ✅ **Drag/resize (`editable`) встроены** — как у dnd.

**Где vis-timeline ХУЖЕ (цена):**
- ❌ **Нет официальной React-обёртки.** Комьюнити-обёртки (`react-vis-timeline` и пр.) заброшены, отстают по версиям, ломаются на React 18/19. По факту оборачиваешь сам императивно: `useRef` + `new Timeline(...)` + ручной teardown и диффы через `DataSet`.
- ❌ **Кастомный контент полоски — HTML-шаблон, не React.** `template: (item, el) => string | HTMLElement`. React-компоненты внутрь нормально не вставить → твой `ICS UI Kit Tooltip` + Tailwind-полоски (которые в обоих прототипах сделаны чисто) **переписывать на строки HTML / ручной DOM**. Главное достоинство текущих прототипов (натив-React контент) теряется.
- ❌ **Свой CSS-каскад** (`.vis-item`, `.vis-label`…) — борьба с `!important`, как у RCT, только шире.
- ❌ **Императивная модель** против декларативной — collapsed/фильтры/overrides синхронишь руками через `DataSet`, а не React state. Больше клея, риск рассинхрона.

**Резюме:** vis-timeline ≠ «dnd с теми же бедами минус обёртка». Выигрываешь встроенный time-windowing и nested-groups; **проигрываешь** React-интеграцию: нет офиц. обёртки, императивщина, контент через HTML-строки (нельзя переиспользовать ICS UI Kit / Tailwind), свой CSS-каскад. Для стека React 19 + ICS UI Kit + Tailwind + декларативный state — шаг назад по DX/кастомизации, несмотря на лучший base-перформанс.

---

## Сводка: эффективность

| Аспект | RCT | dnd | vis-timeline |
|---|---|---|---|
| Стоимость mount на 100 | низкая | низкая | низкая |
| Стоимость mount на 10k | ❌ тяжёлая (нет виртуализации) | ❌ тяжелее (нет + регистрация в `@dnd-kit`) | ✅ легче (time-windowing из коробки) |
| Горизонтальный скролл | ✅ дёшево (канва) | ✅ дёшево (нативный) | ✅ дёшево (перерисовка окна) |
| Zoom шкалы | ✅ дёшево (внутри либы) | ❌ ререндер всех item'ов | ✅ внутри либы |
| Сворачивание группы | ✅ убирает ноды | ✅ убирает ноды | ✅ нативно (nestedGroups) |
| Фоновые ноды сетки | нода на каждый день | только выходные+пн (экономнее) | внутри либы |
| Тултипы | ❌ провайдер на item | ❌ тултип на item | ✅ встроенные (но не React) |
| Путь к 10k | ❌ тупик | ✅ есть (react-virtual) | ✅ из коробки |

## Сводка: кастомизируемость / качество кода

| Аспект | RCT | dnd | vis-timeline |
|---|---|---|---|
| Многоуровневая группировка | ❌ не поддержана (1 уровень) | ✅ N уровней, рекурсия | ✅ нативно (nestedGroups) |
| Сворачивание вложенных | ⚠️ хак на 1 уровень | ✅ `collapsedPaths` на любой | ✅ нативно |
| Кастомный рендер полоски/группы | ✅ render-props | ✅ полностью свой | ❌ HTML-шаблон, не React |
| Стилизация каркаса | ❌ CSS `.rct-*` + `!important` | ✅ чистый Tailwind | ❌ CSS `.vis-*` + `!important` |
| 3-й ярус шапки | ⚠️ из единиц либы | ✅ ещё flex-ряд | ⚠️ из единиц либы |
| TS-типы | ⚠️ часть не экспортится (хак) | ✅ чистые | ⚠️ через заброшенные обёртки |
| React-интеграция | ✅ нативный компонент | ✅ нативные хуки | ❌ императив, нет офиц. обёртки |
| Переиспользование ICS UI Kit/Tailwind в контенте | ✅ да | ✅ да | ❌ нет (HTML-шаблоны) |
| Потолок гибкости | ниже (упираешься в либу) | выше (всё твоё) | средний (но не React) |
| Объём своего кода | меньше (для 1 уровня) | больше (но всё под контролем) | средний + императивный клей |

---

## Итог

- **По `task.md` как он есть** (группировка Канал/Клиент/Бренд + сворачивание секций + 10k от API): реализация на **dnd** объективно ближе к цели — она **единственная** закрывает многоуровневую группировку и **единственная** имеет архитектурный путь к виртуализации 10k. RCT-реализация многоуровневую группировку не закрывает в принципе и в виртуализацию упирается тупиком.
- **RCT-реализация** сильна там, где её не просят: одноуровневый дисплей с `stackItems` и шапкой даром. Качество кода нормальное, но потолок задан библиотекой (beta, плоские группы, CSS-каркас, неэкспортируемые типы).
- **Общий долг обоих React-прототипов** перед масштабом — тултип на каждую полоску. Чинить до любых разговоров про 10k.
- **vis-timeline** — иной компромисс: лучший base-перформанс (time-windowing) и нативные nested-groups, но худшая React-интеграция (нет офиц. обёртки, императив, контент через HTML-шаблоны — нельзя переиспользовать ICS UI Kit/Tailwind). Под ваш стек — шаг назад по DX.

**Рекомендация:** базой брать **dnd**; до прод-нагрузки сделать (1) общий тултип, (2) виртуализацию строк по рецепту выше (`@tanstack/react-virtual`), (3) activation distance для click-vs-drag. `vis-timeline` рассматривать только если base-перформанс на 10k+ окажется критичнее React-DX и кастомного контента.
