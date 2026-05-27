#!/usr/bin/env node
/**
 * generate-legacy-icons.mjs
 *
 * Reads SVG files from the root `icons/` directory and writes pre-encoded
 * data-URI JS modules into `legacy/icons/`.
 *
 * Each generated module exports the data URI as `default` so existing
 * component code can import it identically to a Webpack file-loader URL:
 *
 *   import xmarkIcon from '../../icons/xmark.js';
 *   // xmarkIcon === 'data:image/svg+xml;base64,...'
 *
 * This makes the icons consumable in any Webpack 3 / FOS project without
 * requiring a special SVG loader rule.
 *
 * Usage:
 *   node scripts/generate-legacy-icons.mjs
 *
 * Only the icons listed in ICON_WHITELIST are generated.  All other SVGs in
 * the root `icons/` directory are left untouched — they remain the source
 * of truth for designers and future additions.
 *
 * To add a new icon:
 *   1. Place the SVG in `icons/<name>.svg`.
 *   2. Add `<name>` to ICON_WHITELIST below.
 *   3. Re-run: npm run build:icons
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

/**
 * Whitelist of icon names (without extension) that are actually imported
 * by runtime legacy components.  Stories-only icons are included too so
 * that Storybook keeps working after the *.svg import ban is applied.
 */
const ICON_WHITELIST = [
  // runtime — legacy/components/input-text/InputText.jsx
  'xmark',
  // runtime — legacy/components/calendar/Calendar.jsx
  'chevron-down',
  'chevron-left',
  'chevron-right',
  // runtime — legacy/components/input-birth-date/InputBirthDate.jsx
  'calendar',
  // runtime — legacy/components/spin/Spin.jsx
  'spinner',
  // runtime — legacy/components/theme/Theme.jsx
  'moon',
  'sun',
  // runtime — legacy/components/input-password/InputPassword.jsx
  'eye',
  'eye-slash',
  // runtime — legacy/components/modal/Modal.jsx
  'arrow-rotate-left',
  'volume-regular',
  // storybook only — Button.stories, Tabs.stories, SegmentedControl.stories
  'star-regular',
];

const SRC_DIR = resolve(ROOT, 'icons');
const OUT_DIR = resolve(ROOT, 'legacy', 'icons');

mkdirSync(OUT_DIR, { recursive: true });

let generated = 0;

for (const name of ICON_WHITELIST) {
  const svgPath = resolve(SRC_DIR, `${name}.svg`);
  let svgContent;

  try {
    svgContent = readFileSync(svgPath, 'utf8');
  } catch (err) {
    console.error(`[generate-legacy-icons] ERROR: cannot read ${svgPath}`);
    console.error(err.message);
    process.exit(1);
  }

  const base64 = Buffer.from(svgContent).toString('base64');
  const dataUri = `data:image/svg+xml;base64,${base64}`;

  const jsContent = [
    '// AUTO-GENERATED — do not edit by hand.',
    `// Source: icons/${name}.svg`,
    `// Re-generate with: npm run build:icons`,
    '',
    `var icon = '${dataUri}';`,
    '',
    'module.exports = icon;',
    'module.exports.default = icon;',
    '',
  ].join('\n');

  const outPath = resolve(OUT_DIR, `${name}.js`);
  writeFileSync(outPath, jsContent, 'utf8');

  // Sidecar TypeScript declaration so `import x from '../../icons/<name>.js'`
  // resolves to `string` without requiring a wildcard ambient module.
  const dtsContent = [
    '// AUTO-GENERATED — do not edit by hand. Re-generate with: npm run build:icons',
    'declare const src: string;',
    'export default src;',
    '',
  ].join('\n');

  const dtsPath = resolve(OUT_DIR, `${name}.d.ts`);
  writeFileSync(dtsPath, dtsContent, 'utf8');

  generated += 1;
  console.log(`[generate-legacy-icons] wrote legacy/icons/${name}.js + ${name}.d.ts`);
}

console.log(`[generate-legacy-icons] done — ${generated} icon(s) generated.`);
