# `src/dialogs/` как слой сценарных шаблонов поверх UI kit

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/modal-overlay-surface]] | [[memory/knowledge/concepts/toast-feedback-overlay]] | [[memory/knowledge/concepts/cookies-consent-banner]] | [[memory/logs/2026-04-22]]

## Summary

В проекте введён отдельный слой `src/dialogs/` для готовых сценарных шаблонов, собранных из существующих компонентов UI kit. Внутри него `src/dialogs/modals/` резервируется под шаблоны модальных окон, а `src/dialogs/toasts/` под шаблоны toast-уведомлений и близкие им диалоговые сценарии.

## Why It Matters

Без такого разделения базовая библиотека компонентов быстро смешивается с продуктово-ориентированными композициями. Новое правило удерживает `src/components/` как слой переиспользуемых кирпичиков, а `src/dialogs/` как слой готовых assembled patterns, которые можно развивать отдельно, не размывая границы UI kit.

## Known Patterns

- Держать в `src/components/` только самостоятельные library-компоненты и foundations-уровень.
- Держать в `src/dialogs/` не новые primitives, а собранные из них сценарные шаблоны.
- Для модальных сценариев использовать `src/dialogs/modals/`.
- Для toast-сценариев использовать `src/dialogs/toasts/`.
- Проектировать dialog templates как композиции существующих `Button`, `Input*`, `Modal`, `Toast`, `Switch` и других базовых компонентов, а не как дублирующие реализации.
- Проверять такие шаблоны как отдельные сценарии UI, но не путать их с расширением публичного API базовых компонентов.
- Dialog templates должны использовать специализированные `Input*` компоненты там, где сценарий уже имеет доменное поле: `Captcha` использует `InputCaptcha`, `ProofOfIdentity` использует `InputSurname`.
- Если dialog template использует иконку внутри кнопки, иконка должна наследовать `currentColor` от текста кнопки. Для этого в слое `src/dialogs/` предпочтителен `mask`/`currentColor`, а не `<img>` с зашитой заливкой.
- Для группы toast-сценариев использовать один общий template-слой поверх library-компонента `Toast`, а отдельные сценарии оформлять как тонкие typed-обёртки с фиксированным `message` и `variant`.
- Для toast templates поддерживать и отдельные stories на каждый сценарий, и одну обзорную story с полным набором шаблонов для быстрой визуальной сверки.

## Known Pitfalls

- Складывать продуктовые сценарии обратно в `src/components/`, из-за чего база UI kit перестаёт быть чистой.
- Использовать `src/dialogs/` для разработки новых primitive-компонентов вместо композиции существующих.
- Пытаться жёстко уместить все overlay-сценарии только в `modals` или только в `toasts`, игнорируя фактическую семантику шаблона.
- Подключать в dialog buttons SVG-иконку как обычный `<img>`, если у неё внутри зафиксирован `fill`, из-за чего цвет иконки расходится с цветом текста кнопки в brand-сценариях.
- Дублировать одну и ту же toast-разметку в каждом сценарии вместо общей обёртки поверх базового `Toast`.
- Оставлять в dialog template обычный `InputText` после появления специализированного поля: так сценарий теряет общую фильтрацию и blur-валидацию.

## Related Modules Or Files

- `src/components/`
- `src/dialogs/`
- `src/dialogs/modals/`
- `src/dialogs/toasts/`
- `src/dialogs/modals/captcha/Captcha.tsx`
- `src/dialogs/modals/proof-of-identity/ProofOfIdentity.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/modal-overlay-surface]]
- [[memory/knowledge/concepts/toast-feedback-overlay]]
- [[memory/knowledge/concepts/cookies-consent-banner]]

## Source Logs

- [[memory/logs/2026-04-22]]
- [[memory/logs/2026-04-23]]
