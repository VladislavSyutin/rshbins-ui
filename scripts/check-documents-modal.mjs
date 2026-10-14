import assert from 'node:assert/strict';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true } });
const timers = new Map();
let timerId = 0;
let restored = 0;
global.window = {
  addEventListener() {}, removeEventListener() {},
  setTimeout(callback) { timers.set(++timerId, callback); return timerId; },
  clearTimeout(id) { timers.delete(id); },
  getComputedStyle() { return { getPropertyValue() { return '0ms'; } }; }
};
global.document = { body: { style: { overflow: 'auto' } }, activeElement: { isConnected: true, focus() { restored++; } } };
const flushTimers = () => { for (const [id, callback] of timers) { timers.delete(id); callback(); } };
const documents = [{ id: 'first', title: 'Первый документ', pages: [1, 2].map(n => ({ src: '/page-' + n + '.webp', width: 595, height: 842 })) }];
const viewport = { scrollTop: 0, scrollHeight: 10000, clientHeight: 1000, focus() {} };
let renderer;
let confirms = 0;
let closes = 0;
try {
  const { default: DocumentsModal } = await server.ssrLoadModule('/legacy/components/documents-modal/index.js');
  function mount(data = documents) {
    viewport.scrollTop = 0;
    act(() => { renderer = TestRenderer.create(React.createElement(DocumentsModal, {
      documents: data, dataId: 'review', onConfirm() { confirms++; }, onClose() { closes++; }
    }), { createNodeMock(element) { return element.props.role === 'region' ? viewport : null; } }); });
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
  act(() => { renderer.root.findByProps({ 'data-id': 'policy-documents-modal-confirm' }).props.onClick(); flushTimers(); });
  assert.equal(renderer.root.findAllByType(DocumentsModal).length, 0);
  act(() => screen('CheckActions').props.onConfirm());
  assert.equal(renderer.root.findAllByType(DocumentsModal).length, 0, 'Acknowledged documents do not reopen');
  const Header = (await server.ssrLoadModule('/legacy/components/header/index.js')).default;
  act(() => renderer.root.findByType(Header).props.brandButtonProps.onClick());
  startPolicy();
  act(() => screen('CheckActions').props.onConfirm());
  assert.equal(renderer.root.findAllByType(DocumentsModal).length, 1, 'A new policy resets acknowledgment');
  act(() => renderer.unmount());
  console.log('DocumentsModal: loading, 5%, manual/arrow end, checkbox, retry, close and reopen checks passed.');
  console.log('Policy flow: opens on Confirm, dismissal can reopen, acknowledged review stays closed, new policy resets review.');
} finally {
  if (renderer) act(() => renderer.unmount());
  await server.close();
  delete global.window;
  delete global.document;
}
