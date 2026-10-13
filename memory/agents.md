# Правила работы с памятью проекта

Связанные заметки: [[memory/index]] | [[memory/logs/index]] | [[memory/knowledge/index]]

## Быстрый контекст

- Этот worktree создан для прототипа оформления полиса: `codex/policy-issuance-prototype`.
- Основной worktree `RSHBINS UI` не трогать.
- Разработанные production legacy-компоненты не менять без отдельного запроса.
- Прототип живёт в `legacy/prototypes/policy-issuance/` и нужен для быстрой проверки идеи в Storybook, а не для систематизации дизайн-системы.
- Визуальную проверку проекта через in-app browser, Browser plugin или компьютерный UI выполняет пользователь. Codex не должен самостоятельно открывать, кликать, скриншотить или проверять интерфейс через браузер/компьютер без явного запроса или разрешения пользователя на конкретную проверку.

## Что читать первым

1. [[memory/index]]
2. [[memory/knowledge/index]]
3. [[memory/knowledge/concepts/policy-issuance-prototype]]
4. [[memory/logs/2026-06-01-policy-issuance-prototype]]
