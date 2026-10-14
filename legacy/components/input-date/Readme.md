# InputDate

Поле даты с вводом `ДД.ММ.ГГГГ`, проверкой календарной даты и календарём. Использует `InputText`, `Button`, `Calendar` и токены библиотеки. На мобильных устройствах открывает системный календарь.

`value`/`defaultValue` и `onValueChange` используют форматированную строку. `minDate` и `maxDate` задаются как `Date`; без них диапазон не ограничен. `dataId` передаётся в поле как `data-id`. Ref сохраняет `focus()` и `inputElement`. Проверка обязательного поля выполняется после blur, внешнюю ошибку можно передать через `invalid` и `helperText`.

```jsx
<InputDate label="Дата выдачи" maxDate={new Date()} value={issueDate} onValueChange={setIssueDate} />
```

Календарь, маска и состояния наследуют прежний InputBirthDate. React 17, PropTypes, classnames, plain CSS; новых зависимостей нет.
