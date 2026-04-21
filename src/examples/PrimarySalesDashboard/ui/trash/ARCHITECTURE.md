# Primary Sales Dashboard — архитектура

## Стек

- **zustand** — клиентское состояние: фильтры, UI.
- **TanStack Query** — серверное состояние: ответы API.

Клиентское и серверное состояние решают разные задачи (устаревание, дедупликация, race conditions, loading/error). TanStack Query даёт всё серверное из коробки. zustand держит только то, что принадлежит приложению.

В `orig.js` несколько виджетов шлют `tabular/fetch` с одинаковым фильтром, различающимся только `select`. TanStack Query дедуплицирует одинаковые queryKey — часть избыточных запросов уйдёт сама.

## Структура

```
stores/
  useFiltersStore.ts     // Year, Period, Metric, Currency, Source, Bind Type, Counterparty[], Brand[]
  useUiStore.ts          // tabs, collapsed panels, ...

api/
  client.ts              // обёртка над fetch
  queryKeys.ts           // фабрики queryKey
  fetchers.ts            // чистые функции: (filters) => Promise<raw>

hooks/
  useCardsData.ts        // общий запрос карточек (Value + Units одним вызовом)
  useBaseChart.ts
  useDriversChart.ts
  useDistributorsTable.ts
  useBrandsTable.ts
```

Каждый виджет подписан на `useFiltersStore` (селектор → только нужные поля) и вызывает свой `useXxxQuery`. queryKey зависит от фильтров → смена фильтра автоматически триггерит перезагрузку.

## Решения

### 1. Фильтры — в zustand

Система-хост использует hash-based роутинг, поэтому URL-фильтры сейчас не заводим. Если потом понадобятся — связку zustand ↔ URL добавим отдельным слоем (подписка на стор + парсинг hash при маунте). Архитектура это не ломает: виджеты всё равно читают из zustand, источник обновления невидим для них.

### 2. Batched-запрос для карточек

Обе карточки (`Primary Sales, Value` и `Primary Sales, Units`) получают данные из одного `tabular/fetch` с двумя measure в `select`. Один хук `useCardsData()`, два компонента делают `select`-выборку своего measure из общего результата.

Для остальных виджетов (baseChart, driversChart, таблицы) — отдельные запросы. Если обнаружим ещё объединяемые — смержим по ситуации.

### 3. Форма queryKey

```ts
["primarySales", "cards", { year, currency, sourceType, bindType, counterparties, brands }];
```

Массивы Counterparty/Brand сортируются перед попаданием в ключ, иначе `['A','B']` и `['B','A']` дадут разные кэши.

### 4. Трансформации в `select`

`splitByYear`, `aggregateByGroup` и прочие — чистые функции, передаются через `select` опцию `useQuery`. TanStack Query мемоизирует результат, виджет получает готовую форму. Покрываются юнит-тестами.

### 5. Никакого отдельного "API-слоя"

`fetchers.ts` + `queryKeys.ts` + хуки — этого достаточно. Прослойки, которая "решает что запрашивать", не существует: эту роль выполняет queryKey через реактивность React.

### 6. Персистентность фильтров в localStorage

Через `persist` middleware у zustand. Дефолты при первом заходе — как в `orig.js`: Year=2025, Metric=Units, Currency=RUB, Source Type=MDLP, Bind Type=History, Period=FY.

## План шагов

1. Поднять TanStack Query, настроить `QueryClient`.
2. `useFiltersStore` с `persist`-миддлваром и дефолтами.
3. `queryKeys` + `fetchers` по постман-коллекции.
4. Первый виджет end-to-end — `useCardsData` + обе карточки (batched-паттерн сразу на практике).
5. baseChart → driversChart → таблицы по тому же шаблону.
