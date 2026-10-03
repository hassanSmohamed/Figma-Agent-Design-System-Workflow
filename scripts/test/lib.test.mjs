import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const color = require('../lib/color.js');
const grid = require('../lib/grid.js');

const close = (actual, expected, tol, label) =>
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: expected ${expected} ± ${tol}, got ${actual}`);

test('WCAG ratio: black on white is 21:1', () => {
  close(color.wcagRatio(color.parseHex('#000'), color.parseHex('#fff')), 21, 0.001, 'ratio');
});

test('WCAG ratio: #767676 on white passes 4.5:1', () => {
  assert.ok(color.wcagRatio(color.parseHex('#767676'), color.parseHex('#fff')) >= 4.5);
});

test('APCA 0.0.98G-4g reference values and polarity', () => {
  close(color.apcaLc(color.parseHex('#000'), color.parseHex('#fff')), 106.04, 0.1, 'black on white');
  close(color.apcaLc(color.parseHex('#fff'), color.parseHex('#000')), -107.88, 0.1, 'white on black');
  close(color.apcaLc(color.parseHex('#888'), color.parseHex('#fff')), 63.06, 0.1, '#888 on white');
  close(color.apcaLc(color.parseHex('#fff'), color.parseHex('#888')), -68.54, 0.1, 'white on #888');
});

test('APCA polarity follows colors, not theme: light text on brand fill is negative', () => {
  const r = color.measurePair({ fg: '#FFFFFF', bg: '#0B5FFF', role: 'label-text' });
  assert.ok(r.apcaLc < 0, `expected negative Lc, got ${r.apcaLc}`);
});

test('placeholder is not exempt from WCAG; disabled is', () => {
  const placeholder = color.measurePair({ fg: '#AAAAAA', bg: '#FFFFFF', role: 'placeholder' });
  assert.equal(placeholder.wcagPass, false, `#AAAAAA on white is ${placeholder.wcagRatio}:1`);
  assert.notEqual(placeholder.disposition, 'Pass both');
  const disabled = color.measurePair({ fg: '#AAAAAA', bg: '#FFFFFF', role: 'disabled' });
  assert.equal(disabled.wcagPass, true);
});

test('transparent foreground is composited before measuring', () => {
  // 0x80 alpha = 128/255 ≈ 0.502 → white keeps 49.8% → 0x7F
  const r = color.measurePair({ fg: '#00000080', bg: '#FFFFFF', role: 'body-text' });
  assert.equal(r.fgHex, '#7F7F7F');
});

test('transparent background needs a base', () => {
  assert.throws(() => color.measurePair({ fg: '#000', bg: '#FFFFFF80' }));
  const r = color.measurePair({ fg: '#000', bg: '#FFFFFF80', base: '#000000' });
  assert.equal(r.bgHex, '#808080');
});

test('grid: 3 axes → groups, columns, rows with no overlap', () => {
  const axes = [
    { name: 'Hierarchy', values: ['primary', 'secondary'] },
    { name: 'Size', values: ['sm', 'md', 'lg'] },
    { name: 'State', values: ['default', 'hover', 'focus'] },
  ];
  const variants = [];
  for (const h of axes[0].values)
    for (const s of axes[1].values)
      for (const st of axes[2].values)
        variants.push({
          id: `${h}-${s}-${st}`,
          props: { Hierarchy: h, Size: s, State: st },
          width: { sm: 80, md: 100, lg: 120 }[s] + (st === 'focus' ? 8 : 0),
          height: { sm: 32, md: 40, lg: 48 }[s] + (st === 'focus' ? 8 : 0),
        });
  const plan = grid.planGrid(variants, axes);
  assert.deepEqual(plan.roles, { groups: ['Hierarchy'], columns: 'Size', rows: 'State' });
  assert.equal(plan.positions.length, 18);
  assert.equal(plan.unplaced.length, 0);
  const byId = Object.fromEntries(variants.map((v) => [v.id, v]));
  const boxes = plan.positions.map((p) => ({ ...p, width: byId[p.id].width, height: byId[p.id].height }));
  assert.deepEqual(grid.findOverlaps(boxes), []);
  const first = plan.positions.find((p) => p.id === 'primary-sm-default');
  assert.deepEqual([first.x, first.y], [24, 24]);
});

test('grid: rejects gaps below the package minimum', () => {
  assert.throws(() => grid.planGrid([], [{ name: 'Size', values: ['md'] }], { gap: 20 }));
});

test('grid: unknown values are reported, not placed', () => {
  const plan = grid.planGrid(
    [{ id: 'x', props: { Size: 'xl' }, width: 10, height: 10 }],
    [{ name: 'Size', values: ['sm', 'md'] }],
  );
  assert.deepEqual(plan.unplaced, ['x']);
});
