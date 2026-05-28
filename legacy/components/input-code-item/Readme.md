## Legacy InputCodeItem

`InputCodeItem` is a four-cell confirmation-code input translated from the modern component for the legacy delivery layer.

It accepts one digit per cell, moves focus forward, supports backspace navigation, emits `onValueChange(code)` on every value update, and emits `onComplete(code)` when all four digits are filled. After completion it shows a temporary loading state and then either resets silently or displays the complementary error text according to `completionBehavior`.

Use `dataId` for FOS selectors; it is rendered as `data-id` on the root element.
