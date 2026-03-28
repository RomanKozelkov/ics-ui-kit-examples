# ICS UI Kit Showcase — Детальный план

## Концепция

Сайт-витрина сложных примеров на базе UI Kit ICS.
Аналог [ui.mantine.dev](https://ui.mantine.dev/) — интерактивные превью + исходный код рядом.

**Стек:** Vite + React Router + Tailwind CSS + Shiki (подсветка кода)
**Деплой:** GitHub Pages (чистая статика)
**Репо:** gitlab.ics-it.ru (исходники) → зеркало на GitHub (хостинг)

---

## Референсы и что из них взять

### 1. [shadcn/ui Blocks](https://ui.shadcn.com/blocks) — главный референс

Ближе всего к нашему формату. Что позаимствовать:
- **File tree в code-панели** — при переключении на таб Code показывается дерево файлов
  слева, код выбранного файла справа. Для multi-file примеров это must-have.
- **"Open in New Tab"** — полноэкранный превью компонента без хрома сайта.
- **CLI-команда** — под каждым блоком `npx shadcn add dashboard-01`.
  Наш аналог: `npx degit ics-it/ui-kit-showcase/examples/DataGrid`.

### 2. [Mantine UI](https://ui.mantine.dev/) — оригинальный прототип

Формат страницы категории — все примеры друг под другом с якорными ссылками.
Что позаимствовать:
- **Компактный список** примеров в категории: заголовок-якорь → Preview/Code табы.
- **Минимализм** — ничего лишнего, фокус на примерах.
- **Структура данных** — `attributes.json` в каждой папке компонента.

### 3. [Radix Themes Playground](https://www.radix-ui.com/themes/playground)

Kitchen sink подход — все компоненты на одной странице + Theme Panel сбоку.
Что позаимствовать:
- **Live theme switcher** — если UI Kit поддерживает темизацию, добавить панель
  переключения accent color, radius, dark/light mode на странице preview.
- **Playwright visual regression тесты** — в их репо `apps/playground/tests/`
  лежат скриншот-тесты. Идеально для нашего бонуса с Playwright.

### 4. [Tremor Blocks](https://www.tremor.so/)

Фокус на дашбордах и аналитике. Copy-paste подход.
Что позаимствовать:
- **Категоризация по уровню сложности**: компонент → блок → целая страница.
  Применить к нашим категориям: простые контролы, составные блоки, полные layouts.
- **Готовые layout-ы** как отдельная категория примеров (KPI-секция, таблица
  с фильтрами, форма с валидацией).

### 5. [shadcn/ui Docs — Components](https://ui.shadcn.com/docs/components)

Документация отдельных компонентов (не Blocks).
Что позаимствовать:
- **Несколько вариантов** на одной странице (default, outline, ghost для Button).
  Полезно если один наш пример имеет несколько состояний.
- **Компактный формат** — код прямо под превью, без переключения табов
  для простых однофайловых примеров.

### Сводка: что берём

| Приём | Откуда | Приоритет |
|-------|--------|-----------|
| File tree в code-панели | shadcn Blocks | MVP (этап 3–4) |
| Все примеры категории на одной странице с якорями | Mantine UI | MVP (этап 3) |
| "Open in New Tab" для полноэкранного preview | shadcn Blocks | MVP (этап 4) |
| Live theme switcher | Radix Playground | Бонус |
| Категории по сложности: контрол → блок → страница | Tremor | MVP (этап 2, структура категорий) |
| Playwright visual regression | Radix Themes repo | Бонус |
| Компактный inline-код для простых примеров | shadcn Docs | MVP (этап 3) |

---

## Структура репозитория

```
ui-kit-showcase/
├── examples/                      # ← Папка с примерами (аналог lib/ у Mantine)
│   ├── ContainedInput/
│   │   ├── ContainedInput.tsx      # Главный файл компонента
│   │   ├── ContainedInput.css      # Стили (опционально)
│   │   └── attributes.json         # Метаданные
│   ├── DataGrid/
│   │   ├── DataGrid.tsx
│   │   ├── columns.ts
│   │   └── attributes.json
│   └── ...
│
├── scripts/
│   └── build-manifest.ts           # Prebuild-скрипт: examples/ → JSON
│
├── src/
│   ├── main.tsx                    # Точка входа
│   ├── router.tsx                  # React Router конфигурация
│   ├── components/                 # Компоненты самого сайта (layout, code viewer, etc.)
│   │   ├── Layout.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── ComponentPreview.tsx    # Обёртка: preview + code tabs
│   │   └── CodeBlock.tsx           # Shiki-подсветка
│   ├── pages/
│   │   ├── HomePage.tsx            # /
│   │   ├── CategoryPage.tsx        # /category/:slug
│   │   └── ComponentPage.tsx       # /component/:slug
│   └── data/
│       └── manifest.json           # Генерируется скриптом, в .gitignore
│
├── public/
│   └── manifest.json               # Альтернативное место для манифеста
│
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Формат `attributes.json`

```json
{
  "title": "Editable Data Grid",
  "description": "Grid with inline editing, sorting and row selection",
  "category": "tables",
  "categoryGroup": "Блоки",
  "canvas": {
    "center": true,
    "maxWidth": 800
  }
}
```

Группировка по уровню сложности *(реф: Tremor)*:
- **Контролы** — отдельные сложные компоненты (combobox, tree select, date range picker)
- **Блоки** — составные секции из нескольких компонентов (форма, карточка статистики)
- **Страницы** — полные layout-ы (дашборд, настройки, авторизация)

Внутри каждой группы — категории (`tables`, `inputs`, `navigation`, и т.д.).

---

## Формат сгенерированного `manifest.json`

```json
{
  "components": [
    {
      "name": "ContainedInput",
      "slug": "contained-input",
      "category": "inputs",
      "categoryGroup": "Контролы",
      "title": "Contained Input",
      "description": "Input with label inside",
      "canvas": { "center": true, "maxWidth": 400 },
      "files": [
        {
          "fileName": "ContainedInput.tsx",
          "language": "tsx",
          "code": "import { useState } from 'react';\n..."
        },
        {
          "fileName": "ContainedInput.css",
          "language": "css",
          "code": ".root { ... }"
        }
      ],
      "gitlabPath": "examples/ContainedInput"
    }
  ],
  "categories": {
    "Контролы": {
      "inputs": { "title": "Inputs", "count": 5 },
      "tables": { "title": "Tables", "count": 3 }
    },
    "Блоки": {
      "forms": { "title": "Формы", "count": 4 },
      "stats": { "title": "Статистика", "count": 3 }
    },
    "Страницы": {
      "dashboards": { "title": "Дашборды", "count": 2 },
      "auth": { "title": "Авторизация", "count": 2 }
    }
  }
}
```

---

## Роутинг

| Путь | Страница | Данные |
|------|----------|--------|
| `/` | `HomePage` | Все категории, сгруппированные по categoryGroup |
| `/category/:slug` | `CategoryPage` | Все компоненты этой категории с превью и кодом |
| `/component/:slug` | `ComponentPage` | Один компонент: полноэкранный превью + код |

---

## Этапы реализации

### Этап 0. Скаффолд (2ч)

- [ ] `npm create vite@latest` → React + TypeScript
- [ ] React Router v7 (library mode), Tailwind CSS
- [ ] Структура папок, Layout с хедером
- [ ] Базовый роутинг: три пустых страницы

### Этап 1. Prebuild-скрипт (3ч)

- [ ] `scripts/build-manifest.ts` — сканирует `examples/`, читает файлы, собирает JSON
- [ ] Slug-генерация из PascalCase: `DataGrid` → `data-grid`
- [ ] Категории автоматически из `attributes.json`
- [ ] `gitlabPath` для ссылки на GitLab
- [ ] npm-скрипт: `"prebuild": "tsx scripts/build-manifest.ts"`
- [ ] Результат → `public/manifest.json` (или `src/data/manifest.json` для tree-shaking)

**Решение:** манифест можно или фетчить как JSON из public, или импортировать
напрямую. Для showcase-сайта, где данных немного, прямой import проще:
```ts
// vite умеет импортировать JSON
import manifest from '../data/manifest.json'
```
В этом случае JSON попадает в бандл и никаких лишних запросов.

### Этап 2. Главная страница (3ч)

> **Реф: Tremor** — категории по уровню сложности: контрол → блок → страница.

- [ ] Хедер: название проекта, ссылка на GitLab, ссылка на основной ui-kit.ics-it.ru
- [ ] Hero-секция: заголовок, описание, количество примеров
- [ ] Сетка категорий, сгруппированных по categoryGroup:
  - **Контролы** — отдельные сложные компоненты (combobox, data grid, date picker)
  - **Блоки** — составные секции (форма с валидацией, карточка статистики, фильтры)
  - **Страницы** — полные layout-ы (дашборд, настройки, логин)
- [ ] Карточка категории: название, количество примеров
- [ ] Опционально: SVG-иллюстрации для категорий (можно позже)

### Этап 3. Страница категории (5ч) ← ключевая страница

> **Реф: Mantine UI** — все примеры категории на одной странице с якорями.
> **Реф: shadcn Docs** — для простых однофайловых примеров код inline без табов.

- [ ] Хлебные крошки: Главная → Категория
- [ ] Список компонентов с якорными ссылками (#slug)
- [ ] Каждый компонент отображается как секция:
  - **Заголовок** с якорем
  - **Однофайловый пример** → код inline под preview (как shadcn Docs)
  - **Многофайловый пример** → табы Preview | Code, file tree в code-панели (как shadcn Blocks)
  - **Ссылка на GitLab** (иконка/кнопка)
  - **Ссылка "Open in CodeSandbox"** (→ Этап 8)

#### Ключевое решение: как рендерить preview

Два подхода:

**A. Eager import всех примеров (рекомендую для начала)**
```ts
// examples/index.ts — генерируется prebuild-скриптом
export { default as ContainedInput } from './ContainedInput/ContainedInput'
export { default as DataGrid } from './DataGrid/DataGrid'
// ...
```

Скрипт генерирует файл-реестр. Vite бандлит все примеры.
Просто, работает сразу. Для <100 примеров — норм.

**B. Lazy import (если примеров станет много)**
```ts
const modules = import.meta.glob('../examples/*/index.tsx')
// Загружает чанками по требованию
```

Начинаем с A, переключаемся на B когда будет > 50 примеров.

### Этап 4. Страница компонента (3ч)

> **Реф: shadcn Blocks** — "Open in New Tab" для полноэкранного preview.
> **Реф: shadcn Blocks** — file tree + code panel layout.

- [ ] Полноэкранный preview (iframe или inline)
- [ ] Кнопка **"Open in New Tab"** — рендер компонента без хрома сайта
- [ ] Панель с кодом (справа или снизу)
- [ ] File tree слева + код выбранного файла справа (для multi-file)
- [ ] Табы по файлам компонента
- [ ] Кнопка "View on GitLab"
- [ ] Кнопка "Open in CodeSandbox" (→ Этап 8)
- [ ] Кнопка "Copy code"

### Этап 5. Подсветка кода — Shiki (2ч)

- [ ] Установка shiki, конфигурация темы (match с вашим UI Kit)
- [ ] Компонент `<CodeBlock language="tsx" code={code} />`
- [ ] Поддержка tsx, ts, css
- [ ] Copy-to-clipboard кнопка

**Почему Shiki, а не Prism:**
Shiki использует грамматики VS Code (TextMate), подсветка точнее.
Работает в браузере через WASM, дружит с SSG/SPA.

### Этап 6. Стилизация и полировка (4ч)

- [ ] Tailwind + ваши дизайн-токены из UI Kit
- [ ] Адаптив (мобильный вид категорий и кода)
- [ ] Тёмная тема (если UI Kit поддерживает)
- [ ] Переходы между страницами (View Transitions API или framer-motion)
- [ ] Sticky-хедер, scroll-to-top

### Этап 7. Деплой на GitHub Pages (2ч)

- [ ] `vite.config.ts` → `base: '/ui-kit-showcase/'`
- [ ] GitHub Actions workflow:
  ```yaml
  - run: npm ci
  - run: npm run build    # запустит prebuild → vite build
  - uses: actions/deploy-pages@v4
  ```
- [ ] Либо GitLab CI → push в GitHub mirror → Pages
- [ ] Проверить что SPA-роутинг работает (404.html = index.html hack)

---

### Этап 8. CodeSandbox-интеграция (3ч)

Используем **Define API** — sandbox создаётся на лету из исходного кода,
без дополнительных `package.json` в каждой папке примера.

- [ ] Установить `codesandbox` пакет (или реализовать LZ-сжатие параметров вручную)
- [ ] Утилита `getCodeSandboxUrl(component)`:
  ```ts
  import { getParameters } from 'codesandbox/lib/api/define'

  // Шаблон sandbox'а — единый для всех примеров
  const SANDBOX_TEMPLATE = {
    'package.json': {
      content: {
        dependencies: {
          '@ics/ui-kit': 'latest',
          'react': '^19',
          'react-dom': '^19',
        },
        main: 'index.tsx',
      },
      isBinary: false,
    },
    'index.html': {
      content: '<div id="root"></div>',
      isBinary: false,
    },
    'index.tsx': {
      // Обёртка: импорт компонента, ReactDOM.render, провайдеры UI Kit
      content: (componentName: string) => `
        import { createRoot } from 'react-dom/client'
        import { ThemeProvider } from '@ics/ui-kit'
        import { ${componentName} } from './App'

        createRoot(document.getElementById('root')!)
          .render(<ThemeProvider><${componentName} /></ThemeProvider>)
      `,
      isBinary: false,
    },
  }

  export function getCodeSandboxUrl(component: ComponentInfo): string {
    const files = {
      ...SANDBOX_TEMPLATE,
      'index.tsx': {
        content: SANDBOX_TEMPLATE['index.tsx'].content(component.name),
        isBinary: false,
      },
      // Добавляем все файлы компонента из манифеста
      ...Object.fromEntries(
        component.files.map(f => [
          f.fileName === `${component.name}.tsx` ? 'App.tsx' : f.fileName,
          { content: f.code, isBinary: false },
        ])
      ),
    }
    const parameters = getParameters({ files })
    return `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`
  }
  ```
- [ ] Кнопка "Open in CodeSandbox" на страницах категории и компонента
- [ ] Иконка CodeSandbox (SVG), открывается в новой вкладке

**Почему Define API, а не ссылка на поддиректорию:**
- Не нужен `package.json` / `index.html` в каждой папке примера
- Шаблон sandbox'а (провайдеры, зависимости) задаётся в одном месте
- Работает с GitLab-репо — не требует зеркала на GitHub
- Sandbox всегда актуален — генерируется из тех же исходников, что в манифесте

---

## Бонусы (после MVP)

- [ ] **Поиск** (Cmd+K): fuse.js по заголовкам и описаниям — 2ч
- [ ] **Иллюстрации категорий**: SVG-превью как у Mantine — 4ч
- [ ] **Live theme switcher** *(реф: Radix Playground)*: панель сбоку для переключения
  accent color, radius, dark/light mode в реальном времени — 4ч
- [ ] **Changelog-фильтр**: "Новое в v2.3" — 1ч
- [ ] **llms.txt**: описание компонентов для LLM-инструментов — 1ч
- [ ] **Playwright visual regression** *(реф: Radix Themes repo)*:
  скриншот-тесты всех примеров, запуск в CI — 4ч

---

## Оценка по времени

| Этап | Часы |
|------|------|
| 0. Скаффолд | 2 |
| 1. Prebuild-скрипт | 3 |
| 2. Главная страница | 3 |
| 3. Страница категории | 5 |
| 4. Страница компонента | 3 |
| 5. Подсветка кода | 2 |
| 6. Стилизация | 4 |
| 7. Деплой | 2 |
| 8. CodeSandbox-интеграция | 3 |
| **Итого MVP** | **~27ч** |

---

## Зависимости

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "react-router": "^7",
    "codesandbox": "^2"
  },
  "devDependencies": {
    "vite": "^6",
    "@vitejs/plugin-react": "^4",
    "typescript": "^5.5",
    "tailwindcss": "^4",
    "shiki": "^3",
    "tsx": "^4",
    "glob": "^11"
  }
}
```

Плюс ваш `@ics/ui-kit` как peer-зависимость для примеров.

---

## Workflow разработки нового примера

```bash
# 1. Создать папку
mkdir examples/FancyCombobox

# 2. Написать компонент
# examples/FancyCombobox/FancyCombobox.tsx

# 3. Добавить метаданные
# examples/FancyCombobox/attributes.json
# { "title": "Fancy Combobox", "category": "inputs", ... }

# 4. Пересобрать манифест
npm run build:manifest

# 5. Запустить dev-сервер — увидеть результат
npm run dev
```

При `npm run build` манифест пересобирается автоматически через `prebuild`.