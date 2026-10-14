# PhoneCodeForm

Управляемая форма подтверждения телефона: номер в disabled-поле, четырёхзначный SMS-код, обратный отсчёт, повторная отправка, изменение номера и навигация. `code`, `phone`, `resendSeconds`, `isSubmittingCode` передаёт родитель. Таймеров, запросов и состояния экрана внутри нет.

`onCodeChange` передаёт код; остальные callbacks вызывают действия родителя. «Продолжить» доступна при четырёх цифрах и отсутствии отправки. Повторная отправка появляется при `resendSeconds <= 0`. Использует InputPhone, InputCode, Button, TextLink. `dataId` → корневой `data-id` и префикс дочерних controls.

Стили перенесены из CodeForm/ButtonsRow прототипа; React 17, PropTypes, classnames, plain CSS.
