# ICS UI Kit Examples

Галерея примеров ICS UI Kit на React 19, TanStack Start и Vite 8. Приложение использует стабильный **`ics-ui-kit@1.0.0` и Tailwind CSS 4**. Пакет устанавливается из npm, без локального `link` на исходники кита.

## Запуск

Нужны Node.js 22+ и pnpm версии из `packageManager` в `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Dev-сервер запускается на порту 3000. Примеры доступны из галереи; каждый можно открыть на отдельной странице, переключить тему и посмотреть исходный код.

## Подключение UI Kit

Версия кита зафиксирована в `package.json` и `pnpm-lock.yaml`. Для сборки стилей установлены `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css` и `@tailwindcss/typography`. Vite-плагин Tailwind добавлен к плагинам TanStack Start и React.

```css
/* src/index.css */
@import "tailwindcss";
@import "ics-ui-kit/tailwind.css";
@source "../node_modules/ics-ui-kit/dist";
```

CSS импортируется в `src/routes/__root.tsx`. Путь `@source` считается от CSS-файла. Тема и базовый слой уже включены в `ics-ui-kit/tailwind.css`: копировать их в приложение и отдельно подключать `theme.css` не нужно. Inter подключается через `@fontsource-variable/inter`.

Компоненты импортируются из публичных точек входа:

```tsx
import { Button } from "ics-ui-kit/components/button";
```

JS-пресет, конфигурация Tailwind 3 и старый PostCSS-пайплайн удалены. Полная инструкция по подключению и миграции находится в [репозитории UI Kit](https://gitlab.ics-it.ru/ics/ui-kit/-/blob/master/src/docs/tailwind-integration.mdx).

## Проверка сборки

```bash
pnpm build
pnpm exec vite preview --host 127.0.0.1 --port 4173
```

Откройте локальный адрес, который напечатает preview-сервер, и проверьте примеры, переключение тем и плавающие элементы.

Для проверки того же режима, который публикуется на GitHub Pages, выполните отдельную сборку с `GITHUB_PAGES=true`. В PowerShell:

```powershell
$env:GITHUB_PAGES = "true"
pnpm build
pnpm exec vite preview --host 127.0.0.1 --port 4173
# После остановки preview-сервера:
Remove-Item Env:GITHUB_PAGES
```

В bash:

```bash
GITHUB_PAGES=true pnpm build
GITHUB_PAGES=true pnpm exec vite preview --host 127.0.0.1 --port 4173
```

Этот режим использует базовый путь `/ics-ui-kit-examples/` и пререндеринг. Переменная должна быть установлена и при сборке, и при запуске preview, чтобы базовый путь совпадал. Проверяйте главную страницу по этому пути и прямое открытие страниц примеров. Push в `master` запускает публикацию через `.github/workflows/deploy.yml`.

## Проверка стабильного 1.0.0

29 октября 2026 года приложение проверено с опубликованным npm-пакетом `ics-ui-kit@1.0.0`:

- Установка `pnpm install --frozen-lockfile` проходит без изменения lock-файла.
- В dev в Chrome проверены Select, диалог добавления промо, редактирование поля, оформление и анимация.
- Обычная production-сборка клиента и SSR проходит; в preview отображаются обе реализации ResizableTable. Все 12 маршрутов отвечают HTTP 200.
- Сборка GitHub Pages пререндерит главную и 11 страниц примеров. Все страницы и подключённые из HTML ресурсы доступны в preview; в Chrome проверены Sidebar и тёмная тема по базовому пути `/ics-ui-kit-examples/`.

Сборка предупреждает о крупных JS-чанках. В dev при открытии диалога промо Radix предупреждает об отсутствующем `Description` / `aria-describedby`. Это предупреждения, проверки выше завершаются успешно.

## Обновление UI Kit

Версия `1.0.0` закреплена в манифесте и lock-файле. При следующих обновлениях устанавливайте выбранную опубликованную версию через `pnpm add --save-exact ics-ui-kit@<version>`, коммитьте обновлённый lock-файл и повторяйте проверку dev, обычной production-сборки и сборки GitHub Pages до слияния в `master`.
