# `src/templates/authentication/` как слой auth-шаблонов поверх UI kit

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/knowledge/concepts/dialog-templates-layer]] | [[memory/knowledge/concepts/text-link-component]] | [[memory/logs/2026-04-22]] | [[memory/logs/2026-04-23]]

## Summary

В проекте выделен отдельный каталог `src/templates/authentication/` для шаблонов аутентификации, собранных из уже существующих library-компонентов UI kit. Этот слой предназначен для переиспользуемых auth-композиций, которые позже можно подключать на страницах, не смешивая их ни с primitives в `src/components/`, ни с overlay-сценариями в `src/dialogs/`.

Для legacy delivery тем же шаблонам соответствует зеркальный слой `legacy/templates/authentication/`: там runtime-файлы должны оставаться React 17-compatible, на plain CSS, с `PropTypes`, `classnames`, `dataId -> data-id` и ручной Storybook-регистрацией через `.storybook/main.ts`.

## Why It Matters

Auth-флоу быстро разрастаются в набор близких, но не одинаковых экранных композиций: вход, восстановление пароля, подтверждение кода, смена пароля и так далее. Отдельный template-слой позволяет собирать такие сценарии поверх готовых `Button`, `Input*`, `Checkbox`, `Logo`, `Header` и других компонентов, сохраняя базовую библиотеку чистой и не перегружая `src/dialogs/`, который уже закреплён за модалками и toast-сценариями.

## Known Patterns

- Держать в `src/templates/authentication/` именно композиции для page-level или section-level auth-сценариев.
- Для legacy delivery держать зеркальные auth templates в `legacy/templates/authentication/`, а `src/index.*` использовать только как barrel-экспорт поверх legacy-слоя.
- Использовать этот слой как промежуточную ступень между базовыми components и конкретными страницами приложения.
- Собирать auth templates из существующих UI kit components и token-driven стилей, а не дублировать primitive-разметку.
- Закрепить корректный нейминг `authentication`, чтобы не размножать опечатку `autentication` в путях и импортах.
- Для каждого нового reusable auth-template добавлять Storybook story, потому что Storybook остаётся основной поверхностью визуальной проверки.
- Первый экран авторизации закреплён как `src/templates/authentication/authentication-first-screen/AuthenticationFirstScreen`, а внутри него один template должен переключаться между сценариями физлица и корпоративного клиента, а не разъезжаться на два параллельных экрана.
- Экран восстановления доступа закреплён как `src/templates/authentication/authentication-restoring-access/AuthenticationRestoringAccess` и внутри одного template переключается между восстановлением пароля и восстановлением логина, включая tab-варианты `email/phone`.
- Экран подтверждения телефона закреплён как `src/templates/authentication/authentication-phone-confirmation/AuthenticationPhoneConfirmation` и должен получать `phoneNumber` обязательным prop из flow-контейнера предыдущего шага; примерный номер `+7 (952) 999-99-99` допустим только в Storybook/demo.
- В `AuthenticationPhoneConfirmation` действие `Изм.` не должно знать роутинг или конкретный предыдущий экран: template предоставляет `onChangePhone`, а продуктовый flow-контейнер передаёт туда переход на шаг назад.
- В `AuthenticationPhoneConfirmation` resend-кнопка стартует disabled с текстом `Получить новый код через 59 сек`, через минуту переходит в стандартное состояние `Получить новый код`, а по клику показывает toast `NewCodeHasBeenSent` и повторно запускает таймер.
- Экран подтверждения email закреплён как `src/templates/authentication/authentication-email-confirmation/AuthenticationEmailConfirmation`; он повторяет паттерн phone-confirmation, но использует `email`, `hiddenEmail`, `emailMode`, `onChangeEmail`, заголовок `Введите код из письма` и текст `Отправили по адресу`.
- В `AuthenticationEmailConfirmation` нет дополнительной action-кнопки получения кода другим каналом: по Figma-состоянию есть только resend-кнопка и ссылка `Изм.` для visible email.
- Toast `NewCodeHasBeenSent` внутри `AuthenticationPhoneConfirmation` и `AuthenticationEmailConfirmation` нужно рендерить через portal в `document.body`, чтобы `placement="top-center"` считался как `32px` от верхнего края browser viewport, а не от Storybook/test области или контейнера шаблона.
- В текущем legacy-слое resend feedback для email/phone confirmation нужно собирать через уже существующий `legacy/dialogs/toasts/dialog-toast` с `template="new-code-sent"`, а не через отдельные одноразовые wrapper-компоненты.
- Экран создания логина/пароля закреплён как `src/templates/authentication/authentication-creating-login-password/AuthenticationCreatingLoginPassword`; один template покрывает режимы `login`, `password` и `login-and-password` для desktop/mobile.
- `AuthenticationCreatingLoginPassword` собирается из `Header`, `InputText`, `InputPassword` и `Button`; submit payload отдаётся наружу через `onSubmit`, а template остаётся presentational/form-level и не знает продуктовый роутинг.
- В `AuthenticationCreatingLoginPassword` требования к паролю живут от значения первого password-поля: каждый выполненный пункт получает брендовый цвет, второе password-поле только повторяет пароль, а кнопка активируется только когда все требования выполнены и повтор совпал.
- В текущем legacy worktree уже подтверждён полный auth template-срез: `AuthenticationFirstScreen`, `AuthenticationCreatingLoginPassword`, `AuthenticationEmailConfirmation`, `AuthenticationPhoneConfirmation`, `AuthenticationRegistration`, `AuthenticationRegistrationData`, `AuthenticationRestoringAccess`.
- Все legacy auth templates регистрируются вручную в `.storybook/main.ts`, экспортируются через `src/index.*` и проверяются по live `index.json` на Storybook `6008`.
- `AuthenticationRegistration` собирается как method-switch template (`email` / `phone`) поверх `Tabs`, `InputInn`, `InputEmail`, `InputPhone`, `Checkbox`, `Button`; template должен оставаться form-level и не брать на себя переходы по flow.
- `AuthenticationRegistrationData` использует текущий legacy API `InputMiddleName` через `switchChecked` и `onSwitchChange`, а не старые пропсы из modern reference вроде `withoutMiddleName`.
- `AuthenticationRestoringAccess` собирается как один template с локальными режимами `password` / `login` и tab-вариантами `email` / `phone`; segmented control и tabs управляют только экранными режимами, а flow orchestration остаётся задачей prototype-layer.
- После добавления новых auth templates слой был проверен не только typecheck, но и `build-storybook`, live `index.json` и browser-click smoke test для ключевых переключений (`Registration` и `RestoringAccess`).
- В auth templates `SegmentedControl`, основные action-buttons и form fields должны работать как `fill`-элементы и занимать всю доступную ширину контейнера и на desktop, и на mobile.
- Для auth templates безопаснее использовать явный `device`-режим (`desktop` / `mobile`) вместо надежды только на media query внешнего viewport, чтобы mobile-layout корректно рендерился в Storybook и узких встройках.
- В text-field family для auth-сценариев surface поля должен оставаться прозрачным: `InputText`, `InputPhone`, `InputPassword`, `InputMiddleName` и `InputCode` не должны добавлять собственный фон в обычных состояниях.
- Для ссылок внутри auth templates нужно использовать token-driven link states: `--color-text-brand-link` в default, `--color-text-brand-link-hover` в hover и `--color-text-brand-link-focus` в active/focus-visible.
- Для ссылок и link-like action buttons в legacy auth templates нужно переиспользовать общий `legacy/components/text-link/`, а не дублировать локальные `__link-button` стили в каждом экране.
- Если brand-button внутри auth template использует иконку Госуслуг, иконка должна наследовать `currentColor` через `mask`, а не через `<img>`.
- Overview-story для auth templates нельзя строить на grid-колонках уже самих карточек preview: desktop и mobile превью лучше держать в отдельных сетках с минимальной шириной не меньше `448px` и `361px`, иначе Storybook начнёт визуально наслаивать шаблоны друг на друга.
- Flow-прототипы, собранные из готовых auth templates, складывать отдельно в `src/prototypes/authentication/`, чтобы не смешивать экспериментальные сценарии со стабильными template contracts.

## Known Pitfalls

- Складывать auth page templates сразу в `src/components/`, из-за чего слой primitives начнёт смешиваться с продуктовыми композициями.
- Использовать `src/dialogs/` для полноэкранных или page-level auth-сценариев, хотя этот слой уже отведён под overlay templates.
- Закрепить в структуре опечатку `autentication`, а потом тащить её по imports, stories и документации.
- Оставлять auth layout на `fit-content`/`inline-flex`-поведении базовых components, из-за чего segmented control, inputs и CTA-кнопки не растягиваются на ширину формы.
- Полагаться только на глобальный viewport для mobile-variant и получать «поехавший» layout внутри Storybook cards или других контейнеров фиксированной ширины.
- Строить общий Overview для auth templates на `repeat(auto-fit, minmax(320px, 1fr))`, а внутрь класть desktop-card шириной `448px`: такой Storybook-grid начнёт сжимать ячейки меньше карточек и визуально смешает соседние превью.
- Оставлять разные правила surface/background между `InputText`, `InputPhone`, `InputCode` и compositional-полями вроде `InputMiddleName`, из-за чего text-field family начинает выглядеть несогласованно.

## Related Modules Or Files

- `src/components/`
- `src/templates/`
- `src/templates/authentication/`
- `src/templates/authentication/authentication-first-screen/`
- `src/templates/authentication/authentication-restoring-access/`
- `src/templates/authentication/authentication-phone-confirmation/`
- `src/templates/authentication/authentication-email-confirmation/`
- `src/templates/authentication/authentication-creating-login-password/`
- `legacy/templates/authentication/authentication-first-screen/`
- `legacy/templates/authentication/authentication-creating-login-password/`
- `legacy/templates/authentication/authentication-email-confirmation/`
- `legacy/templates/authentication/authentication-phone-confirmation/`
- `legacy/templates/authentication/authentication-registration/`
- `legacy/templates/authentication/authentication-registration-data/`
- `legacy/templates/authentication/authentication-restoring-access/`
- `src/prototypes/authentication/`
- `src/dialogs/`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/ui-kit-from-figma]]
- [[memory/knowledge/concepts/dialog-templates-layer]]
- [[memory/knowledge/concepts/authentication-prototypes-layer]]
- [[memory/knowledge/concepts/text-link-component]]

## Source Logs

- [[memory/logs/2026-04-22]]
- [[memory/logs/2026-04-23]]
- [[memory/logs/2026-05-28]]
