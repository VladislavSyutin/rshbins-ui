import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server.js';
import { createServer } from 'vite';

// Compile legacy JSX for contract checks without starting a browser or HTTP server.
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom'
});
const loaded = {};
async function component(folder) {
  if (!loaded[folder]) {
    loaded[folder] = (await server.ssrLoadModule('/legacy/components/' + folder + '/index.js')).default;
  }
  return loaded[folder];
}
const noop = () => undefined;
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
let checks = 0;
function contains(html, pattern) {
  assert.match(html, pattern);
  checks += 1;
}

try {
  const InputPassportNumber = await component('input-passport-number');
  contains(render(InputPassportNumber, { value: 'ab123456789012' }), /value="1234 567890"/);
  const InputPassportDivisionCode = await component('input-passport-division-code');
  contains(render(InputPassportDivisionCode, { value: '123x4567' }), /value="123-456"/);
  const InputPromoCode = await component('input-promo-code');
  contains(render(InputPromoCode, { value: 'pRo mo_2026Ж' }), /value="PROMO2026"/);

  const { deleteMaskSeparator } = await server.ssrLoadModule('/legacy/components/input-helpers/createBusinessInput.jsx');
  for (const [value, separator, key, position, expected] of [
    ['1234 567890', ' ', 'Backspace', 5, '123567890'],
    ['1234 567890', ' ', 'Delete', 4, '123467890'],
    ['123-456', '-', 'Backspace', 4, '12456']
  ]) {
    let emitted;
    let prevented = false;
    const input = { selectionStart: position, selectionEnd: position, setSelectionRange: noop };
    deleteMaskSeparator({ key, target: input, preventDefault: () => { prevented = true; } }, { value, commitValue: (next) => { emitted = next; } }, separator);
    assert.equal(emitted, expected);
    assert.equal(prevented, true);
    checks += 1;
  }

  const InputDate = await component('input-date');
  const maxDate = new Date(2026, 9, 13);
  contains(render(InputDate, { value: '20.07.1990', maxDate }), /value="20.07.1990"/);
  contains(render(InputDate, { value: '29.02.2024', maxDate }), /value="29.02.2024"/);
  assert.doesNotMatch(render(InputDate, { value: '29.02.2025', maxDate }), /value="29.02.2025"/);
  assert.doesNotMatch(render(InputDate, { value: '14.10.2026', maxDate }), /value="14.10.2026"/);
  checks += 2;
  const InputBirthDate = await component('input-birth-date');
  contains(render(InputBirthDate, { value: '02.06.2001' }), /value="02.06.2001"/);
  assert.doesNotMatch(render(InputBirthDate, { value: '02.06.2020' }), /value="02.06.2020"/);
  checks += 1;

  const DataRow = await component('data-row');
  contains(render(DataRow, { label: 'Количество', value: 0, dataId: 'count' }), /data-id="count"/);
  contains(render(DataRow, { label: 'Количество', value: 0 }), />0<\/p>/);
  contains(render(DataRow, { label: 'ФИО' }), /Не указано/);
  const DocumentLink = await component('document-link');
  const document = render(DocumentLink, { title: 'Правила', href: '/rules.pdf' });
  contains(document, /href="\/rules.pdf"/);
  contains(document, /target="_blank"/);
  contains(document, /rel="noopener noreferrer"/);

  const Select = await component('select');
  const select = render(Select, { label: 'Тариф', value: 'family', options: [{ value: 'family', label: 'Семейный' }], dataId: 'tariff' });
  contains(select, /role="combobox"/);
  contains(select, /data-id="tariff"/);
  contains(select, /Семейный/);
  const PassportForm = await component('passport-form');
  contains(render(PassportForm, { dataId: 'passport', onChange: noop, value: { number: '1234567890', divisionCode: '000000', issueDate: '20.07.1990', issuedBy: 'ГУ МВД' } }), /data-id="passport-number"/);
  const PolicyholderForm = await component('policyholder-form');
  contains(render(PolicyholderForm, { onChange: noop, value: { lastName: 'Иванов', firstName: 'Иван', middleName: '', noMiddleName: true, birthDate: '02.06.2001', gender: 'male', email: 'demo@example.com' } }), /value="demo@example.com"/);
  const PolicySummary = await component('policy-summary');
  contains(render(PolicySummary, { title: 'Полис', tariff: 'Тариф', term: 'Год', sum: '250 000 ₽', premium: 4875, oldPremium: 5250 }), /rshb-legacy-policy-summary__old-price/);
  const ProductCard = await component('product-card');
  const card = render(ProductCard, { title: 'Полис', imageSrc: '/image.png', dataId: 'product', onCalculate: noop, onDetails: noop });
  contains(card, /data-id="product-calculate"/);
  contains(card, /data-id="product-details"/);
  const PhoneCodeForm = await component('phone-code-form');
  const codeProps = { phone: '9999999990', code: '1234', dataId: 'sms', onBack: noop, onChangePhone: noop, onCodeChange: noop, onSubmitCode: noop, onResendCode: noop };
  contains(render(PhoneCodeForm, { ...codeProps, resendSeconds: 0 }), /data-id="sms-resend-code"/);
  assert.doesNotMatch(render(PhoneCodeForm, { ...codeProps, resendSeconds: 59 }), /data-id="sms-resend-code"/);
  checks += 1;

  // Stored dark mode must survive the prototype's initial render without a light-class override.
  const Prototype = (await server.ssrLoadModule('/legacy/prototypes/policy-issuance/index.js')).default;
  globalThis.window = { localStorage: { getItem: () => 'dark' }, matchMedia: () => ({ matches: false }) };
  const prototype = render(Prototype, {});
  contains(prototype, /class="rshb-policy-issuance"/);
  contains(prototype, /data-mode="dark"/);
  delete globalThis.window;
  const entrypoint = await server.ssrLoadModule('/src/index.js');
  for (const name of ['InputDate', 'InputPassportNumber', 'InputPassportDivisionCode', 'InputPromoCode', 'DataRow', 'DocumentLink', 'Select', 'PassportForm', 'PolicyholderForm', 'PolicySummary', 'ProductCard', 'PhoneCodeForm']) {
    assert.ok(entrypoint[name], name + ' must be publicly exported');
    checks += 1;
  }
  console.log('Passed ' + checks + ' legacy component contract checks (no browser).');
} finally {
  delete globalThis.window;
  await server.close();
}
