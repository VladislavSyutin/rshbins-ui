# InputPromoCode

При вводе и вставке оставляет ASCII-латиницу и цифры; переводит буквы в верхний регистр. Применение и проверка существования кода остаются у родительского экрана.

Компонент использует существующие `InputText` и `createBusinessInput`, сохраняет props базового поля, `dataId` → `data-id`, controlled/uncontrolled режим и ref `focus()`/`inputElement`. React 17, PropTypes, classnames, plain CSS. Не зависит от прототипа.

```jsx
<InputPromoCode value={value} onValueChange={setValue} />
```
