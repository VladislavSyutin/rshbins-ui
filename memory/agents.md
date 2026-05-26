# Правила работы с памятью проекта

Связанные заметки: [[memory/index]] | [[memory/logs/index]] | [[memory/knowledge/index]]

## Как читать память

1. Сначала открыть [[memory/index]].
2. Затем открыть [[memory/knowledge/index]].
3. Затем прочитать релевантные notes из:
   - [[memory/knowledge/concepts/index]]
   - [[memory/knowledge/connections/index]]
   - [[memory/knowledge/decisions/index]]
4. Если уверенности мало, открыть [[memory/logs/index]] и свежие дневные записи.
5. После этого читать код, тесты и git history.

## Стартовый фокус для этого репозитория

- Проект стартует как UI kit на основе дизайна в Figma.
- Уже подтверждённые артефакты в репозитории: `AGENTS.md`, `design-tokens/`, `icons/`, `package.json`, `.storybook/main.ts`, `.storybook/preview.tsx`, `src/`.
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
- Если задача касается runtime-компонентов, первыми проверять `src/theme/`, `src/styles/` и первые foundations stories в `src/components/`.
- Для задач по runtime-компонентам UI kit сначала проверять базовые кирпичики в `src/components/` и их Storybook stories: `button`, `calendar`, `checkbox`, `cookies`, `divider`, `gender`, `gender-item`, `header`, `input-birth-date`, `input-captcha`, `input-code`, `input-code-item`, `input-email`, `input-inn`, `input-login`, `input-middle-name`, `input-name`, `input-password`, `input-phone`, `input-surname`, `input-text`, `modal`, `radio`, `radio-group`, `segment`, `segmented-control`, `spin`, `switch`, `tab`, `tabs`, `theme`, `toast` и соседние component folders.
- Для задач по продуктовым сценариям, собранным из готовых компонентов, использовать слой `src/dialogs/`: `src/dialogs/modals/` предназначен для шаблонов модальных окон, а `src/dialogs/toasts/` для шаблонов уведомлений и близких toast-сценариев.
- Для переиспользуемых auth-композиций между базовыми components и страницами использовать слой `src/templates/authentication/`.
- Для экспериментальных auth-flow и screen-прототипов, собранных из готовых templates, использовать слой `src/prototypes/authentication/`.
- `src/dialogs/` не является слоем новых library-компонентов: туда складываются шаблоны и композиции вроде окна капчи, окна ввода фамилии, success/error toast-сценариев и других готовых диалоговых паттернов поверх существующих компонентов.
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
