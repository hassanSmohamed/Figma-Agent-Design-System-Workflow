/*
 * Color math for contrast checks. Pure functions, no Figma API.
 * Runs in Node (tests) and inside a Figma Plugin API runtime (pasted before a check script).
 *
 * WCAG 2.x relative luminance + contrast ratio.
 * APCA-W3 0.0.98G-4g (pinned). Signed Lc: positive = dark text on light bg, negative = light text on dark bg.
 */

const APCA_VERSION = '0.0.98G-4g';

const APCA = {
  mainTRC: 2.4,
  sRco: 0.2126729,
  sGco: 0.7151522,
  sBco: 0.072175,
  normBG: 0.56,
  normTXT: 0.57,
  revTXT: 0.62,
  revBG: 0.65,
  blkThrs: 0.022,
  blkClmp: 1.414,
  scaleBoW: 1.14,
  scaleWoB: 1.14,
  loBoWoffset: 0.027,
  loWoBoffset: 0.027,
  deltaYmin: 0.0005,
  loClip: 0.1,
};

/** Parse #RGB, #RGBA, #RRGGBB, #RRGGBBAA into { r, g, b, a } with channels 0..1. */
function parseHex(hex) {
  let h = String(hex).trim().replace(/^#/, '');
  if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6 && h.length !== 8) throw new Error(`Invalid hex color: ${hex}`);
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
}

function toHex({ r, g, b }) {
  const c = (v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

/** Blend a (possibly transparent) color over an opaque base, in sRGB like browsers do. */
function composite(fg, base) {
  const a = fg.a === undefined ? 1 : fg.a;
  if (base.a !== undefined && base.a < 1) {
    throw new Error('composite(): base must be opaque. Composite the base over its own background first.');
  }
  return {
    r: fg.r * a + base.r * (1 - a),
    g: fg.g * a + base.g * (1 - a),
    b: fg.b * a + base.b * (1 - a),
    a: 1,
  };
}

function wcagLuminance({ r, g, b }) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function wcagRatio(fg, bg) {
  const l1 = wcagLuminance(fg);
  const l2 = wcagLuminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

function apcaY({ r, g, b }) {
  const t = APCA.mainTRC;
  return APCA.sRco * Math.pow(r, t) + APCA.sGco * Math.pow(g, t) + APCA.sBco * Math.pow(b, t);
}

/** Signed APCA Lc for text color `txt` on background `bg`. */
function apcaLc(txt, bg) {
  let txtY = apcaY(txt);
  let bgY = apcaY(bg);
  const clamp = (y) => (y > APCA.blkThrs ? y : y + Math.pow(APCA.blkThrs - y, APCA.blkClmp));
  txtY = clamp(txtY);
  bgY = clamp(bgY);
  if (Math.abs(bgY - txtY) < APCA.deltaYmin) return 0;

  if (bgY > txtY) {
    const sapc = (Math.pow(bgY, APCA.normBG) - Math.pow(txtY, APCA.normTXT)) * APCA.scaleBoW;
    return sapc < APCA.loClip ? 0 : (sapc - APCA.loBoWoffset) * 100;
  }
  const sapc = (Math.pow(bgY, APCA.revBG) - Math.pow(txtY, APCA.revTXT)) * APCA.scaleWoB;
  return sapc > -APCA.loClip ? 0 : (sapc + APCA.loWoBoffset) * 100;
}

/** Package thresholds (standards/accessibility.md §4). */
const THRESHOLDS = {
  'body-text': { wcag: 4.5, apca: 75 },
  'label-text': { wcag: 4.5, apca: 60 },
  'large-text': { wcag: 3, apca: 45 },
  'non-text-ui': { wcag: 3, apca: 45 },
  placeholder: { wcag: 4.5, apca: 45 },
  disabled: { wcag: 0, apca: 30 },
  decorative: { wcag: 0, apca: 15 },
};

/**
 * Measure one pair. Colors may be hex strings or {r,g,b,a}.
 * `base` is the opaque color beneath a transparent background (optional).
 */
function measurePair({ fg, bg, base, role = 'body-text' }) {
  const asColor = (c) => (typeof c === 'string' ? parseHex(c) : c);
  let bgC = asColor(bg);
  if (bgC.a !== undefined && bgC.a < 1) {
    if (!base) throw new Error('measurePair(): transparent background needs `base`.');
    bgC = composite(bgC, asColor(base));
  }
  const fgC = composite(asColor(fg), bgC);
  const ratio = wcagRatio(fgC, bgC);
  const lc = apcaLc(fgC, bgC);
  const t = THRESHOLDS[role];
  if (!t) throw new Error(`Unknown role: ${role}`);
  const wcagPass = ratio >= t.wcag;
  const apcaPass = Math.abs(lc) >= t.apca;
  let disposition = 'Fail both';
  if (wcagPass && apcaPass) disposition = 'Pass both';
  else if (wcagPass) disposition = 'WCAG only — APCA fail';
  else if (apcaPass) disposition = 'APCA only — WCAG fail';
  return {
    role,
    fgHex: toHex(fgC),
    bgHex: toHex(bgC),
    wcagRatio: Math.round(ratio * 100) / 100,
    wcagPass,
    apcaLc: Math.round(lc * 10) / 10,
    apcaAbs: Math.round(Math.abs(lc) * 10) / 10,
    apcaPass,
    disposition,
    apcaVersion: APCA_VERSION,
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APCA_VERSION,
    THRESHOLDS,
    parseHex,
    toHex,
    composite,
    wcagLuminance,
    wcagRatio,
    apcaLc,
    measurePair,
  };
}
