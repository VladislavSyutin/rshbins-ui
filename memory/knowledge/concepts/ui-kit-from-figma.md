# UI kit на основе Figma

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/design-token-exports]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]] | [[memory/logs/2026-04-17]]

## Summary

Проект создаётся как UI kit, который должен опираться на дизайн в Figma и на экспортированные из него артефакты, уже лежащие в репозитории.

## Why It Matters

Если не зафиксировать Figma как источник структуры и визуальных правил на старте, компоненты, темы и сторис могут начать расходиться с дизайном ещё до появления полноценной библиотеки.

## Known Patterns

- Начинать с foundations: цвета, типографика, отступы, радиусы, эффекты, responsive и motion.
- Дальше собирать иконки и primitive-компоненты, а затем составные компоненты и их stories.
- Переводить большие Figma component sets в typed runtime API и Storybook-matrix, а не в коллекцию разрозненных JSX-вариантов.
- Проверять light/dark и вариативность компонентов в Storybook, а не только в коде компонентов.

## Known Pitfalls

- Кодировать компоненты до того, как понятна структура design tokens и их режимов.
- Хардкодить визуальные значения мимо токенов.
- Описывать Storybook как вторичную документацию вместо основной поверхности визуальной проверки.

## Related Modules Or Files

- `design-tokens/manifest.json`
- `design-tokens/`
- `icons/`
- `.storybook/main.ts`
- `.storybook/preview.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/button-component-matrix]]
- [[memory/knowledge/concepts/spin-component-geometry]]
- [[memory/knowledge/concepts/codex-agent-rules]]
- [[memory/knowledge/concepts/design-token-exports]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
