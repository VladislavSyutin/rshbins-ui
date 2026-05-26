# InputText как floating-label text field с разделением runtime и preview-state

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/storybook-theme-preview]] | [[memory/knowledge/concepts/modal-overlay-surface]] | [[memory/logs/2026-04-21]] | [[memory/logs/2026-04-22]]

## Summary

`src/components/input-text/` реализует Figma-driven text-field family с плавающим лейблом, состояниями `default/hover/focused/typing/entered/error/disabled/keyboard-focused`, clear-кнопкой и отдельными родственными/специализированными вариантами `InputPassword`, `InputPhone`, `InputLogin`, `InputInn`, `InputEmail`, `InputSurname`, `InputName`, `InputMiddleName`, `InputBirthDate`, `InputCode`, `InputCodeItem` и `InputCaptcha`. Базовый modern-паттерн повторяет runtime-логику из Figma Make-прототипа, но выражен через project-native React + TypeScript + SCSS и semantic tokens. В legacy delivery layer базовый `legacy/components/input-text/` теперь тоже должен оставаться чистым primitive: React 17/plain CSS/PropTypes floating-label text field без business masks, календаря, password toggle или switch-варианта. Legacy business inputs живут отдельными public `Input*` компонентами и импортируют `InputText`.

## Why It Matters

Это первый в библиотеке single-line text input с более сложной state-моделью, чем у toggle/select-контролов. Здесь важно не только визуально совпасть с Figma, но и правильно развести mouse focus, keyboard focus, entered/error after blur и preview-only состояния для Storybook-матрицы.

## Known Patterns

- Держать отдельный `previewState` для Storybook/Figma-matrix и не смешивать его с runtime-интерактивностью.
- Для production-like поведения вычислять visual state из `disabled`, `invalid`, текущего значения и факта фокуса.
- Clear-кнопку показывать только при непустом значении и активном фокусе; очистка не должна выбивать фокус из поля.
- Внутри text-field family не использовать placeholder как второй источник текста: плавающий label остаётся единственным ориентиром для пустого поля.
- Helper text показывать только в error-состояниях; в default/hover/focused/entered он не должен занимать вертикальный ритм под полем.
- Плавающий лейбл выражать через абсолютное позиционирование и token-driven typography switch `body -> footnote`, а не через inline Figma styles.
- Для helper/error текста использовать semantic color tokens, а для иконок брать локальные SVG из `icons/`, не временные Figma asset URLs.
- Keyboard-focused state активировать только после реальной клавиатурной навигации, а не после любого `focus-visible` совпадения браузера.
- `InputPassword` строить как sibling-компонент поверх этого паттерна: по умолчанию скрывать ввод, показывать кнопку visibility-toggle только при непустом значении и восстанавливать позицию caret после переключения `password/text`.
- В legacy/FOS delivery не возвращать `mask`, `variant="switch"` и бизнес-валидацию в `InputText`; новые поля должны быть отдельными `legacy/components/input-*` с именем компонента `Input...`.
- Legacy `InputPassword`, `InputBirthDate`, `InputPhone`, `InputSurname`, `InputName`, `InputMiddleName`, `InputCode`, `InputLogin`, `InputInn`, `InputEmail` и `InputCaptcha` импортируют базовый `legacy/components/input-text`, владеют собственной фильтрацией/валидацией и имеют самостоятельные Storybook pages.
- Legacy `InputMiddleName` импортирует универсальный `legacy/components/switch`, рендерит switch `Нет отчества` под полем и переводит input в `disabled`, когда switch включён; switch-логику не добавлять обратно в `InputText`.
- Legacy `InputBirthDate` импортирует `legacy/components/calendar`, форматирует value как `дд.мм.гггг`, показывает календарную кнопку и flyout, валидирует возраст `18-100`; маска `дд.мм.гггг` видна только после фокуса или когда value непустой.
- Legacy `InputPhone` хранит формат `(999) 999-99-99`, показывает префикс `+7` только во время фокуса/введённого значения и валидирует локальную российскую часть номера.
- Для Storybook Controls у node-like props (`label`, `helperText`, `switchLabel`) лучше явно задавать `control: 'text'`; иначе Storybook может подставить `{}`, что React не может отрендерить как child.
- `InputCode` строить как sibling-компонент поверх паттерна `InputText`, но со строгой фильтрацией до `4` цифр, маской `0000`, отключёнными browser suggestions (`autoComplete/autoCorrect/spellCheck`) и раздельной отрисовкой entered-части и placeholder-хвоста маски, чтобы введённые цифры оставались `primary`.
- Специализированные business inputs должны жить как отдельные `Input*` компоненты, даже если визуально переиспользуют `InputText`: `InputLogin`, `InputInn`, `InputEmail`, `InputSurname`, `InputName`, `InputCaptcha`.
- Фильтрация ввода и blur-валидация должны быть внутри specialized input, а consuming template должен получать уже нормализованное значение через `onValueChange`.
- Для form submit gating использовать exported validation helpers (`isEmailValueValid`, `isSurnameValueValid`, `isNameValueValid`, `isMiddleNameValueValid`, `isBirthDateValueValid`, `isCaptchaValueValid`) вместо локальных `trim()` проверок.
- ФИО-компоненты нормализуют первую букву в upper case и запрещают недопустимые разделители на вводе/blur; правила ФИО пока продублированы в `InputSurname`, `InputName` и `InputMiddleName`.
- `InputPhone` хранит российскую локальную часть после `+7`, игнорирует ведущие `7/8`, разрешает первую локальную цифру только `9`, проверяет required, длину и повторяющиеся значения на blur.
- `InputPassword` фильтрует ввод до разрешённого набора латиницы/цифр/спецсимволов, запрещает пробел, `` ` `` и `\`, а required валидирует на blur.
- `InputBirthDate` использует существующий `Calendar` с `minDate/maxDate`; если нужны изменения выбора даты, сначала дорабатывать `legacy/components/calendar`, а не хардкодить календарное поведение в базовом `InputText`.

## Known Pitfalls

- Если определять keyboard focus только через `matches(':focus-visible')`, обычный pointer click в некоторых браузерах может ошибочно переводить поле в чёрную рамку `keyboard-focused`.
- Если не отделить `typing` от `entered`, clear-кнопка и caret начинают отображаться и в blur-состоянии.
- Если при переключении visibility у password input не сохранить `selectionStart/selectionEnd`, браузер может сбрасывать caret в начало строки.
- Если для пустых состояний не скрывать реальный текст input, label и input могут одновременно рисоваться поверх друг друга.
- Если helper/error presentation не вынести в отдельный слой под полем и не ограничить error-состояниями, Storybook matrix быстро перестаёт совпадать с Figma по вертикальному ритму.
- Если docs-страница нового form control висит на спиннере, имеет смысл временно отключить `autodocs` у конкретной story и проверить, живы ли обычные `Playground/Overview`.
- Если поверх value рисуется общий mask-layer, введённые цифры могут визуально сливаться с placeholder; безопаснее разделять mask на filled и placeholder части с разными semantic colors.
- Если компонент переиспользует clear-кнопку из `InputText`, для SVG-mask нужно передавать CSS-переменную `--rshb-input-text-icon-url`, иначе вместо крестика может появляться квадрат-заглушка.
- Если один и тот же input type встречается в dialog/template слое, заменять обычный `InputText` на специализированный компонент, иначе submit gating и визуальная blur-ошибка начнут расходиться между сценариями.
- Для legacy business inputs нельзя оставлять техническую Storybook-витрину вроде `InputBusiness`: каждый public input должен иметь собственный `*.stories.tsx`, title `Legacy/Components/InputX` и папку `legacy/components/input-x/`.
- Не возвращать `''` из birthDate validation для format errors: `Boolean(validationMessage)` станет false, поле не получит `aria-invalid` и не покажет helper text.
- При переименовании компонентов в input-style naming обновлять не только TS exports, но и папку, Storybook title, CSS BEM namespace и consuming template imports.
- В legacy Storybook не оставлять `switchLabel` как auto-detected `node` control: значение `{}` ломает preview ошибкой `Objects are not valid as a React child`. Нужны text controls и/или runtime guard перед передачей children.

## Related Modules Or Files

- `src/components/input-text/InputText.tsx`
- `src/components/input-text/InputText.scss`
- `src/components/input-text/InputText.stories.tsx`
- `src/components/input-password/InputPassword.tsx`
- `src/components/input-password/InputPassword.scss`
- `src/components/input-password/InputPassword.stories.tsx`
- `src/components/input-phone/InputPhone.tsx`
- `src/components/input-login/InputLogin.tsx`
- `src/components/input-inn/InputInn.tsx`
- `src/components/input-email/InputEmail.tsx`
- `src/components/input-surname/InputSurname.tsx`
- `src/components/input-name/InputName.tsx`
- `src/components/input-middle-name/InputMiddleName.tsx`
- `src/components/input-middle-name/InputMiddleName.scss`
- `src/components/input-middle-name/InputMiddleName.stories.tsx`
- `legacy/components/input-text/InputText.jsx`
- `legacy/components/input-text/InputText.stories.tsx`
- `legacy/components/input-text/index.d.ts`
- `legacy/components/input-text/styles.css`
- `legacy/components/input-password/InputPassword.jsx`
- `legacy/components/input-birth-date/InputBirthDate.jsx`
- `legacy/components/input-phone/InputPhone.jsx`
- `legacy/components/input-surname/InputSurname.jsx`
- `legacy/components/input-name/InputName.jsx`
- `legacy/components/input-middle-name/InputMiddleName.jsx`
- `legacy/components/input-code/InputCode.jsx`
- `legacy/components/input-login/InputLogin.jsx`
- `legacy/components/input-inn/InputInn.jsx`
- `legacy/components/input-email/InputEmail.jsx`
- `legacy/components/input-captcha/InputCaptcha.jsx`
- `legacy/components/input-helpers/createBusinessInput.jsx`
- `legacy/components/switch/Switch.jsx`
- `legacy/components/calendar/Calendar.jsx`
- `src/components/input-birth-date/InputBirthDate.tsx`
- `src/components/input-code/InputCode.tsx`
- `src/components/input-code/InputCode.scss`
- `src/components/input-code/InputCode.stories.tsx`
- `src/components/input-code-item/InputCodeItem.tsx`
- `src/components/input-captcha/InputCaptcha.tsx`
- `/Users/vladislavsyutin/Downloads/InputText.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/storybook-theme-preview]]
- [[memory/knowledge/concepts/modal-overlay-surface]]

## Source Logs

- [[memory/logs/2026-04-21]]
- [[memory/logs/2026-04-22]]
- [[memory/logs/2026-04-23]]
