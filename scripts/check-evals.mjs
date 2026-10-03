#!/usr/bin/env node
/*
 * Cheap consistency checks between the skills and the evals (no agent run needed).
 *
 *   node scripts/check-evals.mjs
 *
 * 1. Every `Blocked: …` reason an eval expects matches a block-reason template in a skill or standard.
 * 2. Every skill has at least one case in evals/skills.md.
 * 3. Every "Package X.Y.Z" in skills and evals, every skill's metadata.version, and the top CHANGELOG entry agree.
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, rel, listSkills, parseFrontmatter } from './lib/skill-files.mjs';

const BLOCK_RE = /`(Blocked: [^`]+)`/g;
const errors = [];
const read = (file) => readFileSync(file, 'utf8');
const mdUnder = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const abs = path.join(dir, e.name);
    return e.isDirectory() ? mdUnder(abs) : e.name.endsWith('.md') ? [abs] : [];
  });

/** `{ID}` / `{X}` placeholders and `…` become wildcards; everything else is literal. */
function templateRegex(template) {
  const parts = template.split(/(\{[^}]*\}|…)/);
  const body = parts.map((p) => (p === '…' ? '.*?' : /^\{.*\}$/.test(p) ? '.+?' : p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).join('');
  return new RegExp(`^${body}$`);
}

const skillsDir = path.join(ROOT, 'skills');
const skills = listSkills(skillsDir);
const sourceDocs = [...mdUnder(skillsDir), ...mdUnder(path.join(ROOT, 'standards'))];
const templates = sourceDocs.flatMap((f) => [...read(f).matchAll(BLOCK_RE)].map((m) => templateRegex(m[1])));

const evalDocs = mdUnder(path.join(ROOT, 'evals'));
for (const file of evalDocs) {
  for (const [, reason] of read(file).matchAll(BLOCK_RE)) {
    if (!templates.some((re) => re.test(reason))) errors.push(`${rel(file)}: no skill emits "${reason}"`);
  }
}

const skillCases = read(path.join(ROOT, 'evals', 'skills.md'));
for (const skill of skills) {
  if (!new RegExp(`\\|\\s*${skill}\\s*\\|`).test(skillCases)) errors.push(`evals/skills.md: no positive case for ${skill}`);
}

const versions = new Map();
const note = (version, where) => versions.set(version, [...(versions.get(version) || []), where]);
for (const skill of skills) note(parseFrontmatter(read(path.join(skillsDir, skill, 'SKILL.md'))).data.metadata?.version, `skills/${skill} metadata`);
for (const file of [...sourceDocs, ...evalDocs]) {
  for (const [, v] of read(file).matchAll(/Package (\d+\.\d+\.\d+)/g)) note(v, rel(file));
}
note((read(path.join(ROOT, 'CHANGELOG.md')).match(/^## (\d+\.\d+\.\d+)/m) || [])[1], 'CHANGELOG.md top entry');
if (versions.size > 1) {
  for (const [v, where] of versions) errors.push(`version ${v} in: ${[...new Set(where)].join(', ')}`);
}

errors.forEach((e) => console.error(`FAIL ${e}`));
console.log(`\nChecked ${evalDocs.length} eval files against ${templates.length} block-reason templates and ${skills.length} skills: ${errors.length} problem(s).`);
process.exitCode = errors.length ? 1 : 0;
