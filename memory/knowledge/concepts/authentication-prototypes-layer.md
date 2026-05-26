# `src/prototypes/authentication/` как слой auth-прототипов из templates

Связанные заметки: [[memory/knowledge/index]] | [[memory/knowledge/concepts/index]] | [[memory/knowledge/concepts/authentication-templates-layer]] | [[memory/knowledge/concepts/modal-overlay-surface]] | [[memory/knowledge/concepts/spin-component-geometry]] | [[memory/knowledge/concepts/ui-kit-from-figma]] | [[memory/logs/2026-04-23]] | [[memory/logs/2026-04-24]]

## Summary

В проекте выделен каталог `src/prototypes/authentication/` для prototype pages и authentication-сценариев, которые собираются из готовых шаблонов слоя `src/templates/authentication/`. Текущий `AuthenticationPrototype` уже работает как fullscreen responsive flow-контейнер поверх templates: он сам управляет route-like переходами, тестовыми сценариями, загрузками, toast/modals и возвратом в начало.

## Why It Matters

Auth-прототипы нужны, когда несколько уже готовых templates нужно связать в один проход пользователя: вход, регистрация, подтверждение телефона/email, восстановление доступа или создание логина и пароля. Отдельный prototypes-layer сохраняет границу между экспериментальной настройкой flow и стабильными template-компонентами.

## Known Patterns

- Складывать в `src/prototypes/authentication/` только прототипы authentication-flow и screen-composition work.
- Собирать прототипы из `src/templates/authentication/`, а не дублировать базовую разметку существующих templates.
- Повышать удачные прототипные решения обратно в `templates`, только когда они становятся переиспользуемым контрактом.
- Не использовать prototypes-layer как место для новых primitives UI kit.
- Prototype pages хранить прямо в `src/prototypes/authentication/`, без вложенной папки на каждый экран.
- Prototype page переименован из `FirstScreenIndividuals` в `AuthenticationPrototype`, потому что сценарий вырос из одного экрана в полноценный auth flow.
- `AuthenticationPrototype` рендерится в Storybook как fullscreen responsive story, а не как набор фиксированных M/S/XS карточек.
- На mobile fullscreen auth-прототип выровнен по верхнему краю viewport: верхний отступ контейнера равен `0px`, а нижний сохраняется как минимум `32px`.
- Прототип берёт стартовую тему из `prefers-color-scheme` браузера, но сохраняет ручной переключатель темы через существующий `Header`/`Theme`.
- Начало сценария имитирует brand loading screen на full viewport с `LoaderBrand`, а финальные happy-path ветки также используют fullscreen loader перед возвратом в начало.
- Прототип хранит state последнего введённого телефона и передаёт его дальше в confirmation templates вместо demo-заглушки.
- Flow-сценарии можно собирать из нескольких auth templates и dialog/toast компонентов, если reusable templates сами остаются dumb/presentational.
- Текущий phone-login сценарий в `AuthenticationPrototype` делится на три demo-ветки: любой телефон кроме `79999999990`/`79999999991` после OTP ведёт на `AuthenticationRegistrationData`; `79999999990` после OTP идёт в success path без регистрации и модалки; `79999999991` сначала показывает `ProofOfIdentity`, затем OTP и success path без регистрации.
- Для номера `79999999992` первый экран сначала показывает 3-секундную loading-анимацию кнопки входа, затем открывает `Captcha`; обычный ввод в капче после ещё одной 3-секундной loading-анимации переводит в обычный OTP flow без регистрации, а значение `timeout` после той же задержки открывает `Timeout`.
- `ProofOfIdentity` и `LogInThroughTheGosuslugi` используют 3-секундные loading-состояния перед переходом/показом, а `LogInThroughTheGosuslugi` поверх `AuthenticationRegistrationData` не должен очищать введённые поля.
- Для `AuthenticationRegistrationData` email `info@rshbins.ru` открывает `LogInThroughTheGosuslugi` после 3-секундной загрузки, остальные валидные данные идут в обычный success path.
- Corporate branch первого экрана использует demo-credentials `login`/`password`: после 3-секундной загрузки они ведут в success path, остальные сочетания показывают `TheUserWasNotFound`.
- Восстановление доступа из `AuthenticationRestoringAccess` связывается в prototype-layer: demo-значение `phone` или 10/11 цифр ведёт на скрытый `AuthenticationPhoneConfirmation`, остальные значения вроде `email` ведут на скрытый `AuthenticationEmailConfirmation`, затем после OTP открывается `AuthenticationCreatingLoginPassword` для ввода нового логина и success path после 3-секундной загрузки.
- Ветка восстановления логина использует отдельный visible confirmation flow: после ввода ИНН и email/phone `AuthenticationRestoringAccess` держит 3-секундную loading-анимацию submit-кнопки, затем открывает `AuthenticationEmailConfirmation` или `AuthenticationPhoneConfirmation` без маскирования значения, после OTP идёт на `AuthenticationCreatingLoginPassword` в режиме `login`, а сохранение запускает финальный success path.
- В `AuthenticationRestoringAccess` mobile labels для segmented control короче desktop-версии: на mobile и `auto`-режиме при viewport до `743px` используются `Восстан. пароля` и `Восстан. логина`.
- Ветка регистрации КК использует visible confirmation flow: `AuthenticationRegistration` держит 3-секундную loading-анимацию своей submit-кнопки перед открытием `AuthenticationEmailConfirmation`/`AuthenticationPhoneConfirmation`, затем `InputCodeItem` показывает собственную 3-секундную OTP loading-анимацию и только после неё прототип переводит пользователя на `AuthenticationCreatingLoginPassword` в режиме `login-and-password`.
- В `AuthenticationRegistrationData` строка `InputBirthDate + Gender` не должна растягивать `Gender` по высоте при появлении helper/error текста у даты рождения; layout строки фиксируется через выравнивание по верхнему краю.
- В recovery-code ветке скрытый телефон фиксируется как `+7 (***) ***-99-99`; `InputLogin` сохраняет запрет на `@`, поэтому demo email определяется как не-телефонное значение, а не как настоящий адрес с символом `@`.

## Known Pitfalls

- Начать чинить или расширять reusable template внутри прототипа, оставив изменения недоступными для остальных auth-сценариев.
- Смешать прототипы с `src/templates/authentication/` и сделать статус компонента неочевидным.
- Подключать prototypes как стабильный production API без отдельного решения о промоуте.
- Дублировать auth форму внутри prototype вместо использования `AuthenticationFirstScreen`; это приведёт к расхождению с reusable template.
- Разводить каждый экран в отдельный prototype-раздел с собственным docs/overview вместо плоской сценарной сборки из templates.
- Создавать вложенную папку вроде `first-screen-individuals/`; для таких страниц использовать файлы на уровне `src/prototypes/authentication/`.
- Держать в templates flow-специфичную оркестрацию вроде переходов между phone/email confirmation, `PolicyholderDetails`, modal `ProofOfIdentity` и финальных loaders; это знание должно жить в прототипе, пока не сформирован production flow-container.
- Жёстко хардкодить demo phone/email прямо в confirmation template; это уже приводило к расхождению между первым экраном и шагом подтверждения.
- Менять правила ввода reusable `InputLogin` ради одного prototype branch; если сценарий требует demo email/phone, лучше обрабатывать это в `AuthenticationPrototype`.
- Добавлять задержку поверх `InputCodeItem` без учёта его собственной loading-анимации; для видимого OTP loading переход должен происходить после завершения ожидаемой 3-секундной анимации.
- Включать fullscreen loader там, где Figma-flow уже использует loading конкретной кнопки или OTP-контрола; для registration/recovery видимые переходы теперь специально держатся на локальных loading states, а не на `LoaderBrand`.
- Для mobile native `InputBirthDate` нельзя полагаться только на нативный `input[type=date]`: выбранная дата должна дублироваться в видимом текстовом слое, reset из системного календаря нужно ловить через `input` и `change`, а дата вне диапазона 18-100 лет должна показывать отдельную ошибку, а не маскироваться под пустое обязательное поле.

## Related Modules Or Files

- `src/prototypes/`
- `src/prototypes/authentication/`
- `src/prototypes/authentication/AuthenticationPrototype.tsx`
- `src/prototypes/authentication/AuthenticationPrototype.scss`
- `src/prototypes/authentication/AuthenticationPrototype.stories.tsx`
- `src/templates/authentication/`
- `src/dialogs/toasts/successful-authentication/SuccessfulAuthentication.tsx`
- `src/dialogs/toasts/the-user-was-not-found/TheUserWasNotFound.tsx`
- `src/dialogs/modals/proof-of-identity/ProofOfIdentity.tsx`
- `src/dialogs/modals/log-in-through-the-gosuslugi/LogInThroughTheGosuslugi.tsx`
- `src/dialogs/modals/captcha/Captcha.tsx`
- `src/dialogs/modals/timeout/Timeout.tsx`
- `src/templates/authentication/authentication-restoring-access/AuthenticationRestoringAccess.tsx`
- `src/templates/authentication/authentication-creating-login-password/AuthenticationCreatingLoginPassword.tsx`
- `src/templates/authentication/authentication-registration/AuthenticationRegistration.tsx`
- `src/templates/authentication/authentication-registration-data/AuthenticationRegistrationData.scss`
- `src/components/input-birth-date/InputBirthDate.tsx`

## Related Decisions

- [[memory/knowledge/decisions/adr-bootstrap-from-figma-artifacts]]
- [[memory/knowledge/decisions/adr-encode-figma-workflow-in-agents]]

## Related Concepts

- [[memory/knowledge/concepts/authentication-templates-layer]]
- [[memory/knowledge/concepts/modal-overlay-surface]]
- [[memory/knowledge/concepts/spin-component-geometry]]
- [[memory/knowledge/concepts/ui-kit-from-figma]]

## Source Logs

- [[memory/logs/2026-04-23]]
- [[memory/logs/2026-04-24]]
