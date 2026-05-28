# Правила работы с памятью проекта

Связанные заметки: [[memory/index]] | [[memory/logs/index]] | [[memory/knowledge/index]]

## Когда читать память

- Читать память проекта только по явному запросу пользователя или когда задача прямо требует исторического контекста, ранее принятых решений, session logs или knowledge notes.
- По умолчанию начинать с корневого `AGENTS.md`, кода, тестов и локальной структуры проекта, не открывая `memory/`.
- Если пользователь просит использовать память или без неё нельзя безопасно восстановить контекст, читать её точечно:
  1. Сначала открыть [[memory/index]].
  2. Затем открыть [[memory/knowledge/index]].
  3. Затем прочитать релевантные notes из:
     - [[memory/knowledge/concepts/index]]
     - [[memory/knowledge/connections/index]]
     - [[memory/knowledge/decisions/index]]
  4. Если уверенности мало, открыть [[memory/logs/index]] и свежие дневные записи.

## Стартовый фокус для этого репозитория

- Проект стартует как UI kit на основе дизайна в Figma.
- Уже подтверждённые артефакты в репозитории: `AGENTS.md`, `icons/`, `package.json`, `.storybook/main.ts`, `.storybook/preview.tsx`, `src/index.js`, `src/index.d.ts`, `legacy/`.
- Раскладка кода: реальные компоненты живут в `legacy/components/<name>/` (jsx + css + index.js + index.d.ts + Readme.md + stories.tsx). `src/index.js` и `src/index.d.ts` — тонкий barrel поверх `legacy/`, не редактировать без необходимости. Storybook stories — `legacy/components/<name>/stories.tsx`, регистрация в `.storybook/main.ts`. Токены — `legacy/styles/tokens.css`. Иконки — `icons/` (импортируются как `*.svg` URL).
- Для задач по foundations, темам и визуальной консистентности первыми читать:
  - [[memory/knowledge/concepts/ui-kit-from-figma]]
  - [[memory/knowledge/concepts/authentication-prototypes-layer]]
  - [[memory/knowledge/concepts/dialog-templates-layer]]
  - [[memory/knowledge/concepts/calendar-date-picker]]
  - [[memory/knowledge/concepts/button-component-matrix]]
  - [[memory/knowledge/concepts/input-text-floating-label-control]]
  - [[memory/knowledge/concepts/divider-content-separator]]
  - [[memory/knowledge/concepts/code-input-item-otp-control]]
  - [[memory/knowledge/concepts/design-token-exports]]
  - [[memory/knowledge/concepts/codex-agent-rules]]
  - [[memory/knowledge/concepts/normalized-runtime-tokens]]
  - [[memory/knowledge/concepts/spin-component-geometry]]
  - [[memory/knowledge/concepts/switch-binary-form-control]]
  - [[memory/knowledge/concepts/theme-toggle-control]]
  - [[memory/knowledge/concepts/toast-feedback-overlay]]
  - [[memory/knowledge/concepts/modal-overlay-surface]]
  - [[memory/knowledge/concepts/cookies-consent-banner]]
  - [[memory/knowledge/concepts/storybook-theme-preview]]
  - [[memory/knowledge/connections/figma-artifacts-to-storybook]]
  - [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
  - [[memory/knowledge/decisions/adr-build-normalized-runtime-tokens]]
  - [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]
  - [[memory/knowledge/decisions/adr-use-shared-spin-component-for-loading-states]]
- Если задача касается runtime-компонентов, первыми проверять `legacy/styles/tokens.css` и `legacy/components/`.
- Для задач по runtime-компонентам UI kit сначала проверять базовые кирпичики в `legacy/components/` и их Storybook stories: `button`, `calendar`, `checkbox`, `cookies`, `divider`, `gender`, `gender-item`, `header`, `input-birth-date`, `input-captcha`, `input-code`, `input-code-item`, `input-email`, `input-inn`, `input-login`, `input-middle-name`, `input-name`, `input-password`, `input-phone`, `input-surname`, `input-text`, `modal`, `radio`, `radio-group`, `segment`, `segmented-control`, `spin`, `switch`, `tab`, `tabs`, `theme`, `toast` и соседние component folders.
- Если задача касается Figma-driven имплементации или генерации UI, до чтения кода дополнительно открывать корневой `AGENTS.md`.

## Как использовать память

- Считать knowledge-слой рабочей гипотезой, а не абсолютной истиной.
- Использовать memory как контекстный слой поверх проектных инструкций из корневого `AGENTS.md`, а не вместо него.
- Проверять код перед изменениями, если заметки выглядят устаревшими.
- Фиксировать новые решения и риски после законченного milestone.
- Поддерживать явные wiki-ссылки между связанными notes.

## Как обновлять память

- Для журналов использовать `scripts/project_memory/log_session.py`.
- Для пересборки индексов использовать `scripts/project_memory/flush.py`.
- Для проверки целостности использовать `scripts/project_memory/lint.py`.
