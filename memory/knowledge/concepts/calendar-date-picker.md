# Calendar и InputBirthDate как ввод даты рождения с day/month/year views

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/input-text-floating-label-control]] | [[memory/logs/2026-04-21]] | [[memory/logs/2026-04-22]]

## Summary

`src/components/calendar/` реализует Figma-driven календарь с тремя режимами: `day`, `month` и `year`. Публичный API включает основной `Calendar` и два примитива состояния/ячейки: `CalendarDayItem` и `CalendarPeriodItem`. Поверх него построен `src/components/input-birth-date/` как text-field family-компонент для даты рождения: на desktop он открывает flyout-календарь, а на mobile/tablet уходит в нативный `input[type="date"]`. Оба слоя завязаны на token-driven SCSS, semantic color tokens, `--shadow-flyout`, CSS mask/currentColor для иконок из `icons/` и Storybook stories для общей визуальной проверки. В ветке `legacy` календарь адаптирован в `legacy/components/calendar/` как React 17/plain CSS delivery-компонент для ФОС, а дата рождения подключается как `mask="birthDate"` внутри классического `legacy/components/input-text`, а не как отдельный public component.

## Why It Matters

Calendar стал первым picker-компонентом в библиотеке, где важны не только статические состояния, но и синхронизация выбранной даты между несколькими представлениями. Он задаёт паттерн для будущих date/time pickers: внутренний state machine над нативными кнопками, Figma-паритет без сторонней calendar-зависимости и отдельные exported primitives для story-level проверки состояний.

## Known Patterns

- Если `value` и `onChange` не переданы, `Calendar` работает uncontrolled и открывается на сегодняшней дате (`new Date()`).
- `CalendarDayItem` отвечает за ячейки дневой сетки и различает текущий и соседний месяц через `anotherMonth`.
- `CalendarPeriodItem` используется и для month-grid, и для year-grid.
- Заголовок циклически переключает режимы `day -> month -> year -> day`.
- Иконки заголовка и стрелок берутся из `icons/chevron-down.svg`, `icons/chevron-left.svg`, `icons/chevron-right.svg` и окрашиваются через CSS mask/currentColor, чтобы одинаково работать в светлой и тёмной теме.
- Навигация стрелками анимирована только для режимов, где это соответствует макету: `day` и `year` используют горизонтальный slide контейнера; в `month`-режиме год меняется статично, без анимации периода.
- При клике по дню соседнего месяца календарь переходит в соответствующий месяц и сразу выбирает дату.
- Выбор года учитывает кейс `29 февраля`: если целевой год невисокосный, дата нормализуется на `1 марта`.
- Storybook фиксирует и весь компонент, и отдельные состояния `CalendarDayItem`/`CalendarPeriodItem`, чтобы было проще сверять hover/focus/selected с Figma.
- `InputBirthDate` фиксируется как birth-date control: по умолчанию пустой, с label `Дата рождения`, маской `дд.мм.гггг` и общим визуальным паттерном из text-field family.
- Для desktop `InputBirthDate` использует library `Calendar`, а для mobile/tablet переключается на нативный календарь по breakpoint `m`; для webview-совместимости подписка на `matchMedia` должна поддерживать и `addEventListener`, и legacy `addListener`.
- Валидация даты рождения должна одинаково работать для ручного ввода, нативного пикера и выбора через flyout-календарь: допустимы только реальные даты с возрастом от `18` до `100` лет на момент проверки.
- Для ручного ввода дата фильтруется по сегментам ещё до полного значения: день `01-31`, месяц `01-12`, год только в диапазоне, который можно дополнить до допустимого возраста.
- `Calendar` принимает `minDate` и `maxDate`, чтобы month/year/day view умели отключать недопустимые даты и периоды, а не только надеяться на внешнюю проверку после клика.
- В legacy/FOS delivery `InputText mask="birthDate"` использует `Calendar` через flyout и передаёт возрастной диапазон через `minDate/maxDate`; изменения поведения выбора даты должны идти в `legacy/components/calendar`, а не локальными календарными хардкодами в input.
- В legacy-адаптации заголовок месяца/года и стрелки навигации импортируют универсальный `legacy/components/button`, а не собирают локальные кнопки; локальными `<button>` остаются только picker primitives `CalendarDayItem` и `CalendarPeriodItem`.
- Legacy `Calendar`, `CalendarDayItem` и `CalendarPeriodItem` поддерживают `dataId -> data-id`; stories показывают playground, `day/month/year` overview, состояния ячеек и `LimitedRange`.
- Legacy Calendar CSS должен брать surface/background/shadow из semantic tokens без локальных color/shadow fallback literals, если токены есть в `legacy/styles/tokens.css`.
- В Storybook overview для disabled-ячеек нельзя оборачивать элемент в `pointer-events: none`, иначе не будет виден `cursor: not-allowed`; статические hover/focus previews можно обездвиживать wrapper-ом, но disabled должен принимать hover.

## Known Pitfalls

- Storybook легко маскирует runtime-default, если в `args` жёстко передать demo-date; для проверки поведения по умолчанию не подставлять фиксированное `defaultValue`.
- Для `month`-режима нельзя применять ту же slide-анимацию, что и для `day`/`year`: в макете период один, поэтому анимировать нечего, меняется только label года.
- При обновлении календарных иконок важно сверять именно набор `chevron-*`, а не более длинные `arrow-*`-иконки из общей библиотеки.
- Workspace не является git repository, поэтому локально нельзя опираться на `git status/diff` для проверки memory-изменений.
- В Storybook `Date`-объекты в `meta.args` и нестабильные значения вроде `new Date()` внутри render-аргументов могут приводить к зависанию story на спиннере; safer path — передавать demo-date только из стабильных констант или вовсе не держать дату в args.
- Встроенные браузеры и IAB могут не поддерживать `MediaQueryList.addEventListener`; если responsive-логика подписывается только через новый API, превью компонента может не выйти из loading-состояния.
- В legacy Storybook не дублировать визуально одинаковые disabled-состояния без подписи: достаточно одного `CalendarDayItem disabled`, а сценарии соседних месяцев показывать через default/hover/focused.
- Не оставлять `#ffffff`, `rgb(...)` или shadow fallback прямо в `legacy/components/calendar/styles.css`: такие значения обходят token layer и слабее выглядят на FOS review.

## Related Modules Or Files

- `src/components/calendar/Calendar.tsx`
- `src/components/calendar/Calendar.scss`
- `src/components/calendar/Calendar.stories.tsx`
- `src/components/input-birth-date/InputBirthDate.tsx`
- `src/components/input-birth-date/InputBirthDate.scss`
- `src/components/input-birth-date/InputBirthDate.stories.tsx`
- `legacy/components/calendar/Calendar.jsx`
- `legacy/components/calendar/styles.css`
- `legacy/components/calendar/Calendar.stories.tsx`
- `legacy/components/calendar/index.d.ts`
- `icons/chevron-down.svg`
- `icons/chevron-left.svg`
- `icons/chevron-right.svg`
- `icons/calendar.svg`

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/input-text-floating-label-control]]

## Source Logs

- [[memory/logs/2026-04-21]]
- [[memory/logs/2026-04-22]]
- [[memory/logs/2026-04-23]]
