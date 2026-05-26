# Геометрия Spin как отдельного компонента

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/button-component-matrix]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/decisions/adr-use-shared-spin-component-for-loading-states]] | [[memory/logs/2026-04-17]] | [[memory/logs/2026-04-24]]

## Summary

`src/components/spin/` реализует отдельный reusable loading indicator из Figma. Для него зафиксированы реальные container sizes `2xs=16`, `xs=18`, `s=24`, `m=28`, `l=32`, `xl=38` и общий полный оборот за `800ms`. Практика с дополнительным внутренним `scale` оказалась неверной: для Figma parity spinner должен занимать полный container size, а не сжиматься внутри него. Для size-specific визуальной толщины используются точные Figma SVG path/viewBox, а не только математическое масштабирование.

## Why It Matters

Loading indicator очень легко уходит от макета даже при правильных внешних размерах: визуальная толщина зависит не только от `px`, но и от ratio и самой внутренней геометрии path. Для этого проекта оказалось недостаточно просто масштабировать один и тот же SVG.

## Known Patterns

- Хранить `Spin` как отдельный компонент, а не как локальную border-based анимацию внутри кнопки или других controls.
- Разделять container size и SVG geometry как две независимые оси настройки.
- Сначала проверять, не сжимается ли spinner внутри собственного контейнера; лишний `scale` визуально делает дугу тоньше и меньше Figma.
- Для size-specific parity брать точные Figma SVG assets/path, если даже небольшая разница в path меняет perceived stroke thickness.
- `Spin` должен наследовать `currentColor`, чтобы loading state автоматически подстраивался под токены компонента-хоста.
- Storybook для `Spin` нужен как отдельная точка визуальной валидации размеров, а не только как косвенная часть `Button`.

## Known Pitfalls

- Менять только названия size variants, когда проблема на самом деле в фактических `px`.
- Оставлять внутренний `scale < 1` после перехода на реальные Figma sizes: визуально spinner становится тоньше макета даже при правильном `width/height`.
- Пытаться лечить расхождение толщины только через `scale`, если у размеров в Figma различается сам path.
- Использовать один общий SVG path для всех размеров.
- Делать `Spin` через CSS border-ring, если в Figma он уже задан как конкретная векторная форма.

## Related Modules Or Files

- `src/components/spin/Spin.tsx`
- `src/components/spin/Spin.scss`
- `src/components/spin/Spin.stories.tsx`
- `src/components/button/Button.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-use-shared-spin-component-for-loading-states]]

## Related Concepts

- [[memory/knowledge/concepts/button-component-matrix]]
- [[memory/knowledge/concepts/storybook-theme-preview]]

## Source Logs

- [[memory/logs/2026-04-17]]
- [[memory/logs/2026-04-24]]
