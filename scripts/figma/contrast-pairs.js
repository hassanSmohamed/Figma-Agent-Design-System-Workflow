/*
 * Contrast check for variable pairs, per mode. Read-only.
 * Requires (paste first): scripts/lib/color.js, scripts/figma/helpers.js
 *
 * Usage (last line in the runtime):
 *   return await checkContrastPairs({
 *     modes: [{ Semantic: 'Light' }, { Semantic: 'Dark' }],
 *     pairs: [
 *       { name: 'Primary label on primary fill', fg: 'color/text/on-brand', bg: 'color/bg/brand/default', role: 'label-text' },
 *       { name: 'Focus ring on page', fg: 'color/border/focus', bg: 'color/bg/surface/default', role: 'non-text-ui' },
 *       { name: 'Overlay text', fg: 'color/text/primary', bg: 'color/bg/overlay', base: 'color/bg/surface/default', role: 'body-text' },
 *       { name: 'Placeholder', fg: { name: 'color/text/placeholder', collection: 'Semantic' }, bg: 'VariableID:12:34', role: 'placeholder' },
 *     ],
 *   });
 *
 * fg / bg / base: a variable name, a variable ID (library tokens), or { name, collection } when a name is not unique.
 */

const refLabel = (ref) => (typeof ref === 'string' ? ref : JSON.stringify(ref));

async function checkContrastPairs({ pairs, modes }) {
  const rows = [];
  for (const modeMap of modes) {
    const modeLabel = Object.entries(modeMap).map(([c, m]) => `${c}:${m}`).join(', ');
    for (const pair of pairs) {
      const row = { pair: pair.name, mode: modeLabel, role: pair.role || 'body-text' };
      try {
        const colors = {};
        for (const slot of ['fg', 'bg', 'base']) {
          if (!pair[slot]) continue;
          const v = await findVariable(pair[slot]);
          if (!v) throw new Error(`Variable not found: ${refLabel(pair[slot])}`);
          const r = await resolveVariable(v, modeMap);
          if (r.missing || r.broken || !r.value) throw new Error(`Unresolved ${refLabel(pair[slot])} (${r.chain.join(' → ')})`);
          colors[slot] = r.value;
          row[`${slot}Chain`] = r.chain.join(' → ');
        }
        Object.assign(row, measurePair({ fg: colors.fg, bg: colors.bg, base: colors.base, role: row.role }));
      } catch (e) {
        row.error = String(e.message || e);
        row.disposition = 'Unverified';
      }
      rows.push(row);
    }
  }
  return { apcaVersion: APCA_VERSION, rows };
}
