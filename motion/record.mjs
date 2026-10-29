// Records the FL registration scenario: Storybook prototype inside a styled browser window.
// Frames come from CDP screencast with timestamps; loader waits are cut out in post (see `skips`).
import { chromium } from 'playwright';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';

const STORY = 'http://localhost:6008/iframe.html?id=legacy-prototypes-authentication-authenticationprototype--responsive&viewMode=story';
const W = 1920, H = 1080;
const WIN = { x: 140, y: 60, w: 1640, h: 960, bar: 52 };
const OUTRO_HOLD = Number(process.env.OUTRO_HOLD || 1000);
const OUT = fileURLToPath(new URL('./out/', import.meta.url));
const FRAMES = OUT + 'frames/';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(FRAMES, { recursive: true });

const hostHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}
  html,body{width:${W}px;height:${H}px;overflow:hidden;font-family:-apple-system,"SF Pro Text",Helvetica,Arial,sans-serif}
  body{background:
    radial-gradient(900px 700px at 12% 8%, rgba(255,204,0,.55), transparent 62%),
    radial-gradient(1100px 800px at 92% 100%, rgba(162,203,57,.55), transparent 60%),
    linear-gradient(135deg,#0b3d26 0%,#1d7a40 48%,#58a838 100%)}
  #win{position:absolute;left:${WIN.x}px;top:${WIN.y}px;width:${WIN.w}px;height:${WIN.h}px;border-radius:18px;overflow:hidden;background:#f2f2f2;
    box-shadow:0 50px 120px rgba(4,30,16,.45),0 12px 30px rgba(4,30,16,.25),0 0 0 1px rgba(255,255,255,.18);
    opacity:0;transform:translateY(14px) scale(.985)}
  #bar{height:${WIN.bar}px;background:#ececec;border-bottom:1px solid #d9d9d9;position:relative;display:flex;align-items:center}
  .dots{display:flex;gap:9px;margin-left:20px}.dots i{width:13px;height:13px;border-radius:50%;display:block}
  .dots i:nth-child(1){background:#ff5f57}.dots i:nth-child(2){background:#febc2e}.dots i:nth-child(3){background:#28c840}
  #url{position:absolute;left:50%;top:9px;transform:translateX(-50%);width:520px;height:34px;border-radius:9px;background:#fff;
    display:flex;align-items:center;justify-content:center;gap:8px;font-size:15px;color:#3c3c3c;box-shadow:inset 0 0 0 1px #dcdcdc}
  #url svg{width:13px;height:13px}
  #wrap{position:relative;overflow:hidden;width:${WIN.w}px;height:${WIN.h - WIN.bar}px}
  iframe{border:0;width:100%;height:100%;display:block;background:#f2f2f2}
  #snap{position:absolute;inset:0;width:100%;height:100%;opacity:0;pointer-events:none}
  #cur{position:absolute;left:0;top:0;z-index:10;pointer-events:none;opacity:0;will-change:transform}
  #cur svg{display:block;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35));transform-origin:3px 3px;transition:transform .09s}
  #cur.down svg{transform:scale(.86)}
  .ring{position:absolute;z-index:9;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;pointer-events:none;
    border:3px solid rgba(88,168,56,.95);background:rgba(88,168,56,.22);animation:r .55s ease-out forwards}
  @keyframes r{from{transform:scale(.4);opacity:1}to{transform:scale(4.2);opacity:0}}
</style></head><body>
<div id="win">
  <div id="bar"><div class="dots"><i></i><i></i><i></i></div>
    <div id="url"><svg viewBox="0 0 16 16" fill="#6b6b6b"><path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm-2 5V4.5a2 2 0 1 1 4 0V6H6Z"/></svg><span>rshbins.ru/login</span></div></div>
  <div id="wrap"><iframe id="app" src="${STORY}"></iframe><img id="snap"></div>
</div>
<div id="cur"><svg width="26" height="28" viewBox="0 0 26 28"><path d="M3 2v20l5.2-4.7 3.6 8.2 3.6-1.6-3.6-8H19L3 2Z" fill="#fff" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/></svg></div>
<script>
  const cur = document.getElementById('cur');
  const app = document.getElementById('app');
  const snap = document.getElementById('snap');
  window.moveCursor = (x, y, ms, instant) => { cur.style.transition = (instant ? 'none' : 'transform ' + ms + 'ms cubic-bezier(.5,.05,.2,1),') + 'opacity .22s ease'; cur.style.transform = 'translate(' + x + 'px,' + y + 'px)'; };
  window.showCursor = (v) => { cur.style.opacity = v ? 1 : 0; };
  window.hideForShot = (v) => { cur.style.visibility = v ? 'hidden' : 'visible'; };
  window.press = (x, y) => { cur.classList.add('down'); const r = document.createElement('div'); r.className = 'ring'; r.style.left = x + 'px'; r.style.top = y + 'px'; document.body.appendChild(r); setTimeout(() => cur.classList.remove('down'), 130); setTimeout(() => r.remove(), 700); };
  window.setSnap = (src) => { snap.getAnimations().forEach((a) => a.cancel()); snap.style.opacity = 1; snap.style.transform = 'none'; snap.src = src; };
  // old screen slides out to the left while the new one slides in from the right
  window.slide = (ms) => {
    const ease = 'cubic-bezier(.5,.05,.2,1)';
    const a = snap.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }], { duration: ms, easing: ease, fill: 'forwards' });
    app.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], { duration: ms, easing: ease });
    a.onfinish = () => { a.cancel(); snap.style.opacity = 0; };
  };
  window.winTo = (visible, ms) => { const w = document.getElementById('win'); w.style.transition = 'opacity ' + ms + 'ms ease, transform ' + ms + 'ms cubic-bezier(.2,.7,.2,1)';
    w.style.opacity = visible ? 1 : 0; w.style.transform = visible ? 'none' : 'translateY(-8px) scale(.99)'; };
</script></body></html>`;

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.route('http://localhost:6008/__host.html', (r) => r.fulfill({ contentType: 'text/html; charset=utf-8', body: hostHtml }));
await page.goto('http://localhost:6008/__host.html');
const app = page.frameLocator('#app');

// ---- warm-up off-camera (prototype shows a loader first) ----
await app.getByText('Понятно').click({ timeout: 60000 });
await page.waitForTimeout(400);
await page.evaluate(() => window.moveCursor(1300, 760, 0, true));

// ---- screencast ----
const cdp = await page.context().newCDPSession(page);
const frames = [];
cdp.on('Page.screencastFrame', async (e) => {
  const i = frames.length;
  frames.push({ t: e.metadata.timestamp, a: Date.now() / 1000 });
  fs.writeFileSync(FRAMES + String(i).padStart(5, '0') + '.jpg', Buffer.from(e.data, 'base64'));
  cdp.send('Page.screencastFrameAck', { sessionId: e.sessionId }).catch(() => {});
});
const now = () => Date.now() / 1000;
const skips = [];
const slideMarks = [];
const wait = (ms) => page.waitForTimeout(ms);

await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
await wait(350);
const tStart = now();

const center = async (loc) => {
  const b = await loc.boundingBox();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
};
const moveTo = async (x, y, travel) => {
  await page.evaluate(([x, y, t]) => window.moveCursor(x, y, t), [x, y, travel]);
  await wait(travel + 50);
};
const pressAt = async (x, y) => {
  await page.evaluate(([x, y]) => window.press(x, y), [x, y]);
  await page.mouse.move(x, y);
  await page.mouse.down(); await page.mouse.up();
};
// move cursor onto the element, then click it
const click = async (loc, travel = 420, off = {}) => {
  const c = await center(loc);
  const x = c.x + (off.dx || 0), y = c.y + (off.dy || 0);
  await moveTo(x, y, travel);
  await pressAt(x, y);
};
// freeze the current screen (cursor hidden while shooting so it is not baked in; those frames are cut)
const freeze = async () => {
  const t = now();
  await page.evaluate(() => window.hideForShot(true));
  const shot = await page.screenshot({ type: 'jpeg', quality: 92, clip: { x: WIN.x, y: WIN.y + WIN.bar, width: WIN.w, height: WIN.h - WIN.bar } });
  await page.evaluate((s) => { window.setSnap(s); window.hideForShot(false); }, 'data:image/jpeg;base64,' + shot.toString('base64'));
  skips.push([t - 0.02, now() + 0.06]);
  await wait(120);
};
// slide transition: freeze old screen, run action, cut the loader wait, slide old out / new in
const transition = async (action, ready, { keep = 0.35, ms = 560 } = {}) => {
  await freeze();
  const t0 = now();
  await action();
  await ready.waitFor({ timeout: 20000 });
  await wait(80);
  const t1 = now();
  if (t1 - t0 > keep + 0.1) skips.push([t0 + keep, t1]);
  await page.evaluate((d) => window.slide(d), ms);
  await wait(ms + 60);
};

// aim at the checkbox square itself (left edge of its label, first text line)
const clickBox = async (input, travel) => {
  const b = await input.locator('xpath=..').boundingBox();
  const x = b.x + 11, y = b.y + 11;
  await moveTo(x, y, travel);
  await pressAt(x, y);
};

const phone = app.locator('input[type=text]').first();

// 1. intro: window first, cursor only after it has settled
await page.evaluate(() => window.winTo(true, 700));
await wait(950);
await page.evaluate(() => window.showCursor(true));
await wait(250);

// 2. phone
await click(phone, 800);
await page.keyboard.type('9161234567', { delay: 55 });
await wait(220);
await clickBox(app.locator('input[type=checkbox]').first(), 500);
await wait(220);
const submit = app.getByRole('button', { name: 'Войти по номеру телефона' });
const sc = await center(submit);
await moveTo(sc.x, sc.y, 520);
await pressAt(sc.x, sc.y);
await wait(650); // real spinner on the button, then freeze that state and cut the rest of the wait
await freeze();
const tFrozen = now();
await app.getByLabel('Цифра 1').waitFor({ timeout: 20000 });
await wait(80);
{ const t1 = now(); if (t1 - tFrozen > 0.3) skips.push([tFrozen + 0.1, t1]); }
slideMarks.push(now());
await page.evaluate(() => window.slide(560));
await wait(600);

// 3. code (auto-advances on the 4th digit)
await wait(200);
await page.keyboard.type('4821', { delay: 140 });
await wait(120);
await transition(async () => {}, app.getByRole('button', { name: 'Сохранить данные' }), { keep: 0.15 });

// 4. policyholder data: click every field, type in each
const textInputs = app.locator('input[type=text]');
await wait(120);
await click(textInputs.nth(0), 600);
await page.keyboard.type('Иванов', { delay: 55 });
await click(textInputs.nth(1), 340);
await page.keyboard.type('Иван', { delay: 55 });
await click(textInputs.nth(2), 340);
await page.keyboard.type('Иванович', { delay: 45 });
await click(textInputs.nth(3), 380, { dx: -50 });
await page.keyboard.type('15051988', { delay: 50 });
await click(app.getByText('Муж', { exact: true }), 380);
await click(textInputs.last(), 420);
await page.keyboard.type('ivanov@mail.ru', { delay: 35 });
await wait(80);
await clickBox(app.locator('input[type=checkbox]').last(), 420);
await wait(160);
await click(app.getByRole('button', { name: 'Сохранить данные' }), 450);
await wait(420);

// 5. outro: cursor leaves first, then the window fades back to the gradient (loop point)
await page.evaluate(() => window.showCursor(false));
await wait(250);
await page.evaluate(() => window.winTo(false, 600));
await wait(OUTRO_HOLD);
const tEndWall = now();
await cdp.send('Page.stopScreencast');
await browser.close();

// ---- assemble ----
// screencast timestamps use a different clock than Date.now(): estimate the offset and move our markers into frame time
const off = Math.min(...frames.map((f) => f.a - f.t));
console.log('clock offset (arrival - frame ts), s:', off.toFixed(3), 'median latency over min:', (frames.map((f) => f.a - f.t - off).sort((x, y) => x - y)[Math.floor(frames.length / 2)]).toFixed(3));
for (const k of skips) { k[0] -= off; k[1] -= off; }
const tStartF = tStart - off, tEnd = tEndWall - off;
const kept = frames.filter((f) => f.t >= tStartF - 0.35 && f.t <= tEnd && !skips.some(([a, b]) => f.t > a && f.t < b));
const adj = (t) => t - skips.reduce((s, [a, b]) => s + Math.max(0, Math.min(t, b) - a), 0);
const lines = [];
kept.forEach((f, i) => {
  const idx = frames.indexOf(f);
  const next = kept[i + 1];
  const d = next ? adj(next.t) - adj(f.t) : 0.3;
  lines.push(`file '${FRAMES}${String(idx).padStart(5, '0')}.jpg'`, `duration ${Math.max(d, 0.001).toFixed(4)}`);
});
lines.push(`file '${FRAMES}${String(frames.indexOf(kept[kept.length - 1])).padStart(5, '0')}.jpg'`);
fs.writeFileSync(OUT + 'list.txt', lines.join('\n'));
const total = adj(tEnd) - adj(kept[0].t);
for (const m of slideMarks) { const inW = frames.filter((f) => f.t >= m - 0.05 && f.t <= m + 0.6); console.log('slide@', m.toFixed(2), 'frames in window:', inW.length, inW.map((f) => (f.t - m).toFixed(3)).join(' ')); }
console.log('frames', frames.length, 'kept', kept.length, 'skips', skips.map(([a, b]) => (b - a).toFixed(2)), 'duration≈', total.toFixed(2));
const common = ['-y', '-f', 'concat', '-safe', '0', '-i', OUT + 'list.txt', '-vf', 'fps=60,format=yuv420p', '-r', '60'];
execFileSync(ffmpegPath, [...common, '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-movflags', '+faststart', OUT + 'registration-fl.mp4'], { stdio: 'inherit' });
execFileSync(ffmpegPath, [...common, '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', OUT + 'registration-fl.webm'], { stdio: 'inherit' });
console.log('done');
