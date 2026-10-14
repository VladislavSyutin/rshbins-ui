import assert from 'node:assert/strict';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true } });
const timers = new Map();
const deadlines = new Map();
let elapsed = 0;
let timerId = 0;
let restored = 0;
global.window = {
  addEventListener() {}, removeEventListener() {},
  setTimeout(callback, delay = 0) { timers.set(++timerId, callback); deadlines.set(timerId, elapsed + delay); return timerId; },
  clearTimeout(id) { timers.delete(id); deadlines.delete(id); },
  getComputedStyle() { return { getPropertyValue() { return '0ms'; } }; }
};
global.document = { body: { style: { overflow: 'auto' } }, activeElement: { isConnected: true, focus() { restored++; } } };
const flushTimers = () => { for (const [id, callback] of timers) { timers.delete(id); deadlines.delete(id); callback(); } };
const advanceTime = duration => {
  elapsed += duration;
  for (const [id, callback] of timers) {
    if (deadlines.get(id) <= elapsed) { timers.delete(id); deadlines.delete(id); callback(); }
  }
};
const documents = [{ id: 'first', title: 'Первый документ', pages: [1, 2].map(n => ({ src: '/page-' + n + '.webp', width: 595, height: 842 })) }];
const viewport = { scrollTop: 0, scrollHeight: 10000, clientHeight: 1000, focus() {} };
let renderer;
let confirms = 0;
let closes = 0;
try {
  const { default: DocumentsModal } = await server.ssrLoadModule('/legacy/components/documents-modal/index.js');
  function mount(data = documents, extra = {}) {
    viewport.scrollTop = 0;
    act(() => { renderer = TestRenderer.create(React.createElement(DocumentsModal, Object.assign({
      documents: data, dataId: 'review', onConfirm() { confirms++; }, onClose() { closes++; }
    }, extra)), { createNodeMock(element) { return element.props.role === 'region' ? viewport : null; } }); });
  }
  const checkbox = () => renderer.root.findByType('input');
  const button = suffix => renderer.root.findByProps({ 'data-id': 'review-' + suffix });
  const scroll = offset => act(() => { viewport.scrollTop = offset; renderer.root.findByProps({ role: 'region' }).props.onScroll(); });
  const load = () => act(() => { renderer.root.findAllByType('img').forEach(img => img.props.onLoad()); });
  const arrowCount = () => renderer.root.findAllByProps({ 'data-id': 'review-scroll-to-end' }).length;
  mount();
  assert.equal(document.body.style.overflow, 'hidden');
  assert.equal(checkbox().props.disabled, true);
  assert.equal(button('confirm').props.disabled, true);
  assert.equal(arrowCount(), 0);
  scroll(9000);
  assert.equal(checkbox().props.disabled, true, 'An unloaded set cannot be acknowledged');
  scroll(0);
  load();
  assert.equal(checkbox().props.disabled, true);
  scroll(449);
  assert.equal(arrowCount(), 0, 'Arrow must not appear before 5%');
  scroll(450);
  assert.equal(arrowCount(), 1, 'Arrow appears at 5%');
  act(() => button('scroll-to-end').props.onClick());
  assert.equal(checkbox().props.disabled, false);
  assert.equal(arrowCount(), 0);
  assert.equal(button('confirm').props.disabled, true);
  scroll(0);
  assert.equal(checkbox().props.disabled, false, 'Returning to top preserves end reached');
  act(() => checkbox().props.onChange({ target: { checked: true } }));
  assert.equal(button('confirm').props.disabled, false);
  act(() => checkbox().props.onChange({ target: { checked: false } }));
  assert.equal(button('confirm').props.disabled, true, 'Unchecking disables confirmation');
  act(() => checkbox().props.onChange({ target: { checked: true } }));
  const confirm = button('confirm').props.onClick;
  act(() => { confirm(); confirm(); flushTimers(); });
  assert.equal(confirms, 1);
  assert.equal(closes, 1);
  act(() => renderer.unmount());
  assert.equal(document.body.style.overflow, 'auto');
  assert.equal(restored, 1);
  mount();
  load();
  assert.equal(checkbox().props.checked, false);
  assert.equal(checkbox().props.disabled, true, 'Reopening resets end reached');
  scroll(9000);
  assert.equal(checkbox().props.disabled, false, 'Manual scrolling to end works');
  act(() => renderer.unmount());
  mount();
  act(() => renderer.root.findAllByType('img')[0].props.onError());
  assert.equal(renderer.root.findAllByProps({ role: 'alert' }).length, 1);
  assert.equal(button('confirm').props.disabled, true);
  const retry = button('retry');
  act(() => retry.props.onClick());
  assert.equal(renderer.root.findAllByProps({ role: 'alert' }).length, 0);
  assert.equal(viewport.scrollTop, 0);
  load(); scroll(9000);
  assert.equal(checkbox().props.disabled, false, 'Retry can recover');
  const layer = renderer.root.findByProps({ className: 'rshb-legacy-modal-layer' });
  const target = {};
  act(() => layer.props.onClick({ target: {}, currentTarget: target }));
  assert.equal(timers.size, 0, 'Clicking modal content does not close it');
  act(() => { layer.props.onClick({ target, currentTarget: target }); flushTimers(); });
  assert.equal(closes, 2, 'Backdrop uses the shared Modal close path');
  act(() => renderer.unmount());
  mount(documents, { closeOnConfirm: false });
  load(); scroll(9000);
  act(() => checkbox().props.onChange({ target: { checked: true } }));
  act(() => { button('confirm').props.onClick(); button('confirm').props.onClick(); });
  assert.equal(confirms, 2, 'Controlled confirmation still fires only once');
  assert.equal(timers.size, 0, 'Controlled confirmation keeps the modal open');
  const pendingProps = Object.assign({}, renderer.root.findByType(DocumentsModal).props, { confirmLoading: true });
  act(() => renderer.update(React.createElement(DocumentsModal, pendingProps)));
  assert.equal(button('confirm').props['aria-busy'], true);
  assert.equal(button('confirm').props.disabled, true);
  assert.equal(button('close').props.disabled, true);
  assert.equal(checkbox().props.disabled, true);
  const pendingLayer = renderer.root.findByProps({ className: 'rshb-legacy-modal-layer' });
  act(() => pendingLayer.props.onClick({ target, currentTarget: target }));
  assert.equal(timers.size, 0, 'Backdrop cannot dismiss a pending confirmation');
  assert.equal(closes, 2);
  act(() => renderer.unmount());
  // Exercise the existing policy flow through its composed screen callbacks, without browser UI.
  window.localStorage = { getItem() { return 'light'; }, setItem() {} };
  document.documentElement = { style: {}, classList: { contains() { return false; }, toggle() {} } };
  const Prototype = (await server.ssrLoadModule('/legacy/prototypes/policy-issuance/index.js')).default;
  const ProductCard = (await server.ssrLoadModule('/legacy/components/product-card/index.js')).default;
  function screen(name) { return renderer.root.find(node => typeof node.type === 'function' && node.type.name === name); }
  function startPolicy() {
    const card = renderer.root.findAllByType(ProductCard).find(node => node.props.title.startsWith('Страхование от несчастных случаев'));
    act(() => card.props.onCalculate());
    act(() => { screen('CustomizeScreen').props.onPhoneChange('79999999990'); screen('CustomizeScreen').props.onConsentChange(true); });
    act(() => { screen('CustomizeScreen').props.onSubmitPhone(); flushTimers(); });
    act(() => screen('CustomizeScreen').props.onCodeChange('1234'));
    act(() => { screen('CustomizeScreen').props.onSubmitCode(); flushTimers(); });
  }
  act(() => { renderer = TestRenderer.create(React.createElement(Prototype, { defaultCategory: 'health' }), {
    createNodeMock(element) { return element.props.role === 'region' ? viewport : null; }
  }); });
  startPolicy();
  act(() => screen('CheckActions').props.onConfirm());
  assert.equal(renderer.root.findAllByType(DocumentsModal).length, 1, 'Confirm opens documents');
  act(() => { renderer.root.findByProps({ 'data-id': 'policy-documents-modal-close' }).props.onClick(); flushTimers(); });
  act(() => screen('CheckActions').props.onConfirm());
  assert.equal(renderer.root.findAllByType(DocumentsModal).length, 1, 'Dismissed review opens again');
  viewport.scrollTop = 0;
  load();
  scroll(9000);
  act(() => checkbox().props.onChange({ target: { checked: true } }));
  const policyConfirm = renderer.root.findByProps({ 'data-id': 'policy-documents-modal-confirm' }).props.onClick;
  act(() => { policyConfirm(); policyConfirm(); });
  assert.equal(renderer.root.findAllByType(DocumentsModal).length, 1, 'Modal remains open while confirming');
  assert.equal(renderer.root.findByProps({ 'data-id': 'policy-documents-modal-confirm' }).props['aria-busy'], true);
  assert.equal(timers.size, 1, 'Repeated clicks schedule only one transition');
  act(() => advanceTime(2999));
  assert.equal(renderer.root.findAllByProps({ 'data-id': 'policy-payment-pending' }).length, 0);
  assert.equal(renderer.root.findAllByType(DocumentsModal).length, 1);
  act(() => advanceTime(1));
  assert.equal(renderer.root.findAllByType(DocumentsModal).length, 0);
  const paymentScreen = renderer.root.findByProps({ 'data-id': 'policy-payment-pending' });
  assert.equal(paymentScreen.findAllByType('button').length, 0, 'Payment content has no buttons');
  assert.equal(paymentScreen.findByType('h1').children.join(''), 'Ожидаем подтверждения оплаты');
  assert.equal(paymentScreen.findByType('p').children.join(''), 'Это может занять несколько минут');
  assert.equal(paymentScreen.findAllByType('img').length, 1);
  assert.equal(renderer.root.findAllByProps({ 'data-id': 'policy-account' }).length, 1, 'Account button remains in the header');
  act(() => advanceTime(60000));
  assert.equal(renderer.root.findAllByProps({ 'data-id': 'policy-payment-pending' }).length, 1, 'Waiting is the final screen');
  const Header = (await server.ssrLoadModule('/legacy/components/header/index.js')).default;
  act(() => renderer.root.findByType(Header).props.brandButtonProps.onClick());
  startPolicy();
  act(() => screen('CheckActions').props.onConfirm());
  assert.equal(renderer.root.findAllByType(DocumentsModal).length, 1, 'A new policy resets acknowledgment');
  load(); scroll(9000);
  act(() => checkbox().props.onChange({ target: { checked: true } }));
  act(() => renderer.root.findByProps({ 'data-id': 'policy-documents-modal-confirm' }).props.onClick());
  act(() => renderer.root.findByType(Header).props.brandButtonProps.onClick());
  assert.equal(timers.size, 0, 'Returning to start cancels pending confirmation');
  act(() => advanceTime(3000));
  assert.equal(renderer.root.findAllByProps({ 'data-id': 'policy-payment-pending' }).length, 0);
  startPolicy();
  act(() => screen('CheckActions').props.onConfirm());
  load(); scroll(9000);
  act(() => checkbox().props.onChange({ target: { checked: true } }));
  act(() => renderer.root.findByProps({ 'data-id': 'policy-documents-modal-confirm' }).props.onClick());
  act(() => renderer.unmount());
  assert.equal(timers.size, 0, 'Unmounting cancels pending confirmation');
  console.log('DocumentsModal: loading, 5%, manual/arrow end, checkbox, retry, close and reopen checks passed.');
  console.log('Policy flow: pending modal, 2999/3000 ms transition, final payment screen, repeat clicks, reset and unmount cancellation passed.');
} finally {
  if (renderer) act(() => renderer.unmount());
  await server.close();
  delete global.window;
  delete global.document;
}
