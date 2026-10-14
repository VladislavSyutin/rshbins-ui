# InputPassportNumber

Маска `0000 000000`; 10 цифр, разделитель добавляется автоматически. `onValueChange` возвращает форматированную строку. Проверка полноты — после blur.

Компонент использует существующие `InputText` и `createBusinessInput`, сохраняет props базового поля, `dataId` → `data-id`, controlled/uncontrolled режим и ref `focus()`/`inputElement`. React 17, PropTypes, classnames, plain CSS. Не зависит от прототипа.

```jsx
<InputPassportNumber value={value} onValueChange={setValue} />
```
