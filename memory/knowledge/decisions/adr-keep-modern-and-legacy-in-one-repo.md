# ADR: Держать modern и legacy UI слои в одном репозитории

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/decisions/index]] | [[memory/logs/index]] | [[memory/knowledge/concepts/legacy-delivery-layer]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/logs/2026-04-29]] | [[memory/logs/2026-05-07]]

## Status

Accepted

## Context

- ФОС использует React 17, Webpack 3, Babel legacy, plain CSS и старый набор UI-зависимостей, тогда как текущий репозиторий развивает современный Storybook-first UI kit.
- Команде нужен и быстрый modern-цикл для Figma parity, и удобная поставка компонентов разработчикам ФОС без ручной перепаковки каждого файла.

## Decision

- Оставить src/ и текущий Storybook как modern source of truth для дизайна, токенов и визуальной разработки.
- Вести рядом каталог legacy/ с React 17-compatible реализациями, plain CSS, copy-friendly entrypoints и локальными README.
- Разделить Storybook на явные разделы Modern/* и Legacy/*, чтобы visual review не смешивал source layer и delivery layer.

## Alternatives Considered

- Откатить весь проект к ограничениям legacy-стека ФОС — отклонено, потому что это ухудшает основной UI kit и замедляет Figma-driven разработку.
- Вести две долгоживущие ветки modern и legacy — отклонено, потому что они будут разъезжаться и усложнят поддержку.
- Отдавать ФОС напрямую код из modern src/ — отклонено, потому что там есть React 19 / Storybook / TS / Sass-специфика, неудобная для их среды.

## Consequences

- Появляется отдельный слой адаптации, который надо поддерживать синхронно с modern-компонентами по мере роста каталога.
- Компоненты для ФОС становятся предсказуемее для копирования и интеграции, а modern UI kit сохраняет скорость развития.
- Пилотные компоненты legacy-слоя стоит проверять не только визуально в Storybook, но и по возможности через интеграцию в окружение ФОС.

## Related Concepts

- [[memory/knowledge/concepts/legacy-delivery-layer]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]

## Source Logs

- [[memory/logs/2026-04-29]]
- [[memory/logs/2026-05-07]]
