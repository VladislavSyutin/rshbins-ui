# Card

Нейтральный preview-shell для legacy-слоя. Компонент не содержит сценарной логики и дает только базовую обертку: фон, скругление и clipping без внутренних отступов.

## Импорт

```js
import Card from 'rshbins-legacy-foundations/legacy/components/card';
```

## Пример

```jsx
<Card
  dataId="preview-card"
  style={{
    width: 448,
    border: '1px dashed var(--color-border-default-default)'
  }}
>
  <div style={{ padding: 'var(--space-paddings-inside-m)' }}>
    <h3 style={{ margin: 0 }}>Заголовок</h3>
    <div>Контент карточки</div>
  </div>
</Card>
```

## Props

- `dataId`: пробрасывается как `data-id`
- `className`, `style`, `children`: стандартные props контейнера
- по умолчанию компонент уже задает `background`, `border-radius` и `overflow: hidden`
