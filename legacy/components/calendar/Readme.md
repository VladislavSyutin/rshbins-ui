## Legacy Calendar

React 17-compatible delivery of the calendar component for FOS integration.

### Files

- `Calendar.jsx` — component implementation with `day`, `month`, and `year` views
- `styles.css` — plain CSS styles for the flyout surface and picker cells
- `index.js` — default export entry point plus named item exports
- `index.d.ts` — TypeScript contract for consuming apps and Storybook

### Integration Notes

- Keep CSS imports enabled in the target Webpack pipeline.
- The component does not depend on Storybook, Sass, or React 18/19 APIs.
- Header chevrons import SVG assets from the root `icons/` folder and render them through CSS masks for `currentColor` support.
- `value`, `defaultValue`, `onChange`, `minDate`, `maxDate`, and `initialView` mirror the modern calendar behavior.
- `dataId` maps to `data-id` on the calendar root; item primitives expose the same prop.
- `CalendarDayItem` and `CalendarPeriodItem` are exported for focused previews and custom layouts.

### Example

```jsx
import React from 'react';
import Calendar from './index';

export default function Example() {
  return <Calendar dataId="birth-date-calendar" initialView="day" />;
}
```
