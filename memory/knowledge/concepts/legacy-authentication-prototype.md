# legacy/prototypes/authentication/ как слой legacy auth-прототипов

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/logs/index]] | [[legacy-delivery-layer]] | [[authentication-prototypes-layer]] | [[2026-05-08]]

## Summary

legacy/prototypes/authentication/ содержит AuthenticationPrototype.jsx — полный 1:1 порт modern AuthenticationPrototype.tsx на legacy-стек (JSX, var-style, React 17). Компонент реализует весь flow аутентификации: первый экран (ФЛ/КК), OTP по телефону/email, восстановление доступа, регистрацию, создание логина/пароля, данные страхователя. Все demo-сценарии captcha/proof-of-identity/gosuslugi идентичны modern.

## Why It Matters

- ФОС получает прототип на legacy-компонентах для визуальной демонстрации полного auth-flow без зависимости от modern Storybook-first стека.

## Known Patterns

- Импортировать SCSS из src/prototypes/authentication/AuthenticationPrototype.scss (shared стили)
- Использовать legacy-компоненты через index.js-алиасы из legacy/components/, legacy/templates/, legacy/dialogs/
- Стиль кода — var + Object.assign, без spread-типов и TypeScript

## Known Pitfalls

- FilledCookies в legacy не поддерживает policyLinkProps — только policyHref, ссылка откроется в том же табе
- index.d.ts legacy-шаблонов содержат устаревшие типы payload, но реальный JSX-код корректен — доверять коду, не типам

## Related Modules Or Files

- legacy/prototypes/authentication/AuthenticationPrototype.jsx
- legacy/prototypes/authentication/AuthenticationPrototype.stories.tsx
- legacy/prototypes/authentication/index.d.ts
- legacy/prototypes/authentication/index.js

## Related Decisions

- Отдельные решения пока не привязаны.

## Related Concepts

- [[legacy-delivery-layer]]
- [[authentication-prototypes-layer]]

## Source Logs

- [[2026-05-08]]
