/*
 * Shared helpers for bundle-skills.mjs and validate-skills.mjs (Node only, not for Figma).
 */
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const LINK_RE = /\[([^\]]*)\]\(([^)\s]+?)(#[^)\s]*)?\)/g;

export const toPosix = (p) => p.split(path.sep).join('/');
export const rel = (abs, base = ROOT) => toPosix(path.relative(base, abs));
export const isExternal = (href) => /^[a-z]+:/i.test(href) || href.startsWith('#');

/** Skill folder names under a directory that contain a SKILL.md. */
export function listSkills(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((s) => !s.startsWith('.') && existsSync(path.join(dir, s, 'SKILL.md')));
}

/** Relative links in a Markdown text, resolved against the file's folder. */
export function linksIn(text, fileAbs) {
  return [...text.matchAll(LINK_RE)]
    .filter(([, , href]) => !isExternal(href))
    .map(([whole, label, href, anchor = '']) => ({ whole, label, href, anchor, target: path.resolve(path.dirname(fileAbs), href) }));
}

/** Rewrite relative links; mapTarget(absTarget, label, anchor) returns the replacement or null to keep the link. */
export function rewriteLinks(text, fileAbs, mapTarget) {
  return text.replace(LINK_RE, (whole, label, href, anchor = '') => {
    if (isExternal(href)) return whole;
    return mapTarget(path.resolve(path.dirname(fileAbs), href), label, anchor) ?? whole;
  });
}

/**
 * Parse the YAML frontmatter subset the skills use: one-line `key: value` pairs and one level of
 * nested maps (for `metadata`). Returns { data, raw, body, bodyStartLine } or null when there is no
 * frontmatter. `raw` keeps the unparsed values ("metadata.version" → '"2.2.0"') so quoting can be checked.
 */
export function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return null;
  const data = {};
  const raw = {};
  let parent = null;
  for (const line of m[1].split('\n')) {
    if (!line.trim()) continue;
    const nested = line.match(/^\s+([\w-]+):\s*(.*)$/);
    const top = line.match(/^([\w-]+):\s*(.*)$/);
    if (nested && parent) {
      data[parent][nested[1]] = unquote(nested[2]);
      raw[`${parent}.${nested[1]}`] = nested[2];
    } else if (top && top[2] === '') data[(parent = top[1])] = {};
    else if (top) {
      parent = null;
      data[top[1]] = unquote(top[2]);
      raw[top[1]] = top[2];
    }
  }
  return { data, raw, body: text.slice(m[0].length), bodyStartLine: m[0].split('\n').length };
}

function unquote(v) {
  const m = v.match(/^(['"])(.*)\1$/);
  return m ? m[2] : v;
}
