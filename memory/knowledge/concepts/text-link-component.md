# TextLink как общий legacy-компонент текстовой ссылки

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/authentication-templates-layer]] | [[memory/knowledge/concepts/cookies-consent-banner]] | [[memory/logs/2026-05-28]]

## Summary

`legacy/components/text-link/` закреплён как общий React 17-compatible компонент для текстовых ссылок и link-like actions в legacy delivery-слое. Он рендерится как `<a>` или `<button>`, использует общий token-driven зелёный link style и поддерживает два размера: `m` для самостоятельных action-ссылок вроде `Забыли логин или пароль?` и `Изм.`, `s` для inline-ссылок внутри legal/cookie-copy вроде `передачу и обработку` и `Политикой АО СК «РСХБ-Страхование»`.

## Why It Matters

До появления `TextLink` auth templates и `Cookies` держали одинаковое поведение ссылки в виде локальных `__link-button` CSS-блоков и захардкоженных `<a>/<button>` элементов. Это разъезжало типографику, link states и поддержку future-изменений. Общий компонент фиксирует единый visual contract и уменьшает дублирование в шаблонах.

## Known Patterns

- Runtime-файлы живут в `legacy/components/text-link/` по стандартному legacy delivery shape: `TextLink.jsx`, `styles.css`, `index.js`, `index.d.ts`, `Readme.md`, `TextLink.stories.tsx`.
- `href` по умолчанию включает anchor-режим, а `as="button"` используется для action-ссылок без навигации.
- `size="m"` соответствует body-sized action links в auth templates.
- `size="s"` соответствует footnote-sized inline links в consent/cookie текстах.
- Состояния default/hover/active/focus-visible завязаны на `--color-text-brand-link`, `--color-text-brand-link-hover` и `--color-text-brand-link-focus`.
- `dataId` сохраняется и пробрасывается как `data-id`.
- Storybook story для `TextLink` регистрируется вручную в `.storybook/main.ts`, как и у остальных legacy public components в этом репозитории.

## Known Pitfalls

- Не стоит возвращаться к локальным `__link-button` стилям в auth/cookies шаблонах, если отличие касается только размера или семантики `a` vs `button`.
- Storybook demo-ссылки не должны уводить review-сессию на внешний сайт; в stories нужно гасить навигацию через `preventDefault`.
- Если потребуется отдельная визуальная тема для cookie-ссылки, лучше переопределять CSS custom property на consumer-слое, а не клонировать компонент.

## Related Modules Or Files

- `legacy/components/text-link/`
- `legacy/templates/authentication/authentication-first-screen/`
- `legacy/templates/authentication/authentication-registration/`
- `legacy/templates/authentication/authentication-registration-data/`
- `legacy/templates/authentication/authentication-restoring-access/`
- `legacy/templates/authentication/authentication-email-confirmation/`
- `legacy/templates/authentication/authentication-phone-confirmation/`
- `legacy/components/cookies/`
- `.storybook/main.ts`
- `src/index.js`
- `src/index.d.ts`

## Related Concepts

- [[memory/knowledge/concepts/authentication-templates-layer]]
- [[memory/knowledge/concepts/cookies-consent-banner]]

## Source Logs

- [[memory/logs/2026-05-28]]
