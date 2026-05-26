# iCloud Drive recovery для RSHBINS UI

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/logs/2026-05-06]] | [[memory/knowledge/concepts/public-github-publication-boundary]]

## Summary

`RSHBINS UI` нельзя держать в iCloud вместе с `node_modules` и build outputs. iCloud/FileProvider плохо переносит тысячи мелких npm-файлов: файлы могут стать dataless, материализация зависает, `brctl status` показывает активные downloader-задачи на старых путях, а `git`, `rsync` и чтение файлов начинают подвисать.

## Current Working Copy

Рабочая локальная копия для Codex и агентов:

- `/Users/vladislavsyutin/Documents/Codex/2026-05-06/rshbins`

Эта копия создана из GitHub, затем дополнена восстановленной `memory/` и локальными `scripts/project_memory/`. В ней установлены зависимости через `npm install`; `npm run typecheck` и `npm run build` проходили после восстановления.

## iCloud Copy

Синхронизируемая iCloud-копия:

- `/Users/vladislavsyutin/Library/Mobile Documents/com~apple~CloudDocs/Documents/Вайбкодинг/RSHBINS UI`

Она должна оставаться чистой копией проекта без:

- `node_modules/`
- `dist/`
- `storybook-static/`

## Recovery Pattern

- Если iCloud-загрузка проекта зависла, сначала проверить свободное место: `df -h /System/Volumes/Data "$HOME"`.
- Проверить статус iCloud/FileProvider: `brctl status` и `fileproviderctl evaluate <path>`.
- Не пытаться дочитывать весь проект через `rsync`, если `node_modules` dataless: общий обход может зависнуть.
- Восстанавливать исходники из GitHub, а внутренние project-memory файлы точечно из iCloud или локальных шаблонов.
- После восстановления запускать `npm install` только вне iCloud-папки.
- Если старая iCloud-папка содержит повреждённый snapshot, заменить её чистой копией без генерируемых директорий.

## Known Pitfalls

- Папка может физически уже не содержать `node_modules`, но `brctl status` ещё некоторое время показывает stale downloader-задачи по старому пути. Обычно стоит дождаться cleanup-окна или перезагрузить macOS.
- Публичный GitHub intentionally не содержит `memory/` и `scripts/project_memory/`, потому что они исключены `.gitignore`.
- `.claude/settings.local.json` и `debug-storybook.log` не являются критичными исходниками; их не стоит считать блокерами восстановления.

## Related Modules Or Files

- `.gitignore`
- `package.json`
- `package-lock.json`
- `memory/`
- `scripts/project_memory/`

## Source Logs

- [[memory/logs/2026-05-06]]
