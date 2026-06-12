Code Review — panel-managment
🔴 Критичные — ломают весь сайт (не только пример)
Loader (src/plugins/vite-plugin-components.ts → getAllComponents) обходит все папки src/examples при сборке/деве. Любой сбой = падает виртуальный модуль virtual:components = весь сайт мёртв. Два бага гарантируют падение:

1. attributes.json пустой (0 байт) → components.ts:89 JSON.parse("") кидает SyntaxError: Unexpected end of JSON input. Сравни: соседи 99–111 байт. Нужен валидный JSON со category (loader группирует по attributes.category — components.ts:108). Без него — краш.

2. Имя папки ≠ имя главного файла. components.ts:45 читает ${componentName}.tsx, где componentName = имя папки = panel-managment. Файл ManagementPanel.tsx. → readFileSync(.../panel-managment.tsx) = ENOENT = краш. Конвенция везде: папка === главный файл (DonutLegendSort/DonutLegendSort.tsx, SidebarNavigation/SidebarNavigation.tsx). Чини: переименуй файл в panel-managment.tsx, либо папку в ManagementPanel.

3. Вложенная структура невидима loader'у. getComponentCode делает readdirSync только верхнего уровня, без рекурсии. controls/, store/, data/ — игнор. Viewer кода покажет только ManagementPanel.tsx + types.ts. Вся суть примера (7 контролов + zustand store) скрыта. Либо плоская раскладка как у DonutLegendSort, либо чинить loader рекурсией.

🟠 Серьёзные
4. Мусорные пустые папки api/ и components/ — 0 файлов. Удалить. Loader на пустые папки не падает (читает файлы, не дирректории через .filter), но шум.

5. Опечатка panel-managment → management. Протекает в URL-slug (convertCase → panel-managment). Чинить сейчас, пока не закоммичено в master.

6. Cross-feature связь. Контролы тащат FilterField из ../../../shared/bi-dashboard/ui/FilterField — глубокий относительный путь + семантика «bi-dashboard» в промо-панели. Если это общий компонент — вынести в shared/ui/, не под фичу bi-dashboard.

🟡 Мелкие / логика
7. persist без version/migrate/partialize (usePanelStore.ts:47). Поменяешь форму PanelState — старый localStorage регидратит битьё. Для примера ок, для прода — добавь version.

8. year дефолт new Date().getFullYear() персистится → через границу года залипает старый год, кнопка «Показать текущий день» навсегда disabled. Осознанно? Иначе year не персистить (partialize).

9. Асимметрия MonthRange (MonthRangeSelect.tsx:36): «По» дизейблит i < monthFrom, «С» не дизейблит i > monthTo. Store-инвариант (Math.max/Math.min) спасает, но UI непоследователен.

10. TodayButton: new Date() каждый рендер (TodayButton.tsx:11) — не реактивен к смене суток в полночь. Дёшево, некритично.

11. MONTHS_RU без as const, а YEARS с ним — несогласовано (options.ts:6).

✅ Хорошо
Атомарные селекторы zustand ((s) => s.field) — нет лишних рендеров.
Инвариант months в store, не в UI — правильное место.
makeStaticLoader точно матчит сигнатуру LoadOptionsResult<T> = { options } ui-kit. Чисто.
Типы (Grouping, SortBy) узкие, без string.
Приоритет: #1–#3 блокеры — без них пример не грузится и роняет весь сайт. 