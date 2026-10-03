#!/usr/bin/env node
/*
 * Build install bundles from the single source (skills/, standards/, catalog/, scripts/).
 *
 *   node scripts/bundle-skills.mjs
 *
 * Output (Agent Skills layout, https://agentskills.io/specification):
 *   dist/skills/<skill>/SKILL.md          entry file, ends with a "Bundled files" list (every file one hop away)
 *   dist/skills/<skill>/references/*.md   standards, catalog, worked examples (flat names)
 *   dist/skills/<skill>/scripts/*.js      Figma Plugin API reference scripts
 *   dist/single/<skill>.md                one Markdown file without scripts (Figma in-app custom skills)
 *   dist/slim/<skill>.md                  SKILL.md + the <!-- core --> sections of the standards it uses (small context)
 *
 * Only files linked from a SKILL.md (directly or through other linked files) are included.
 * Links into another skill are not followed — refer to other skills by command name (/ds-…).
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, rel, listSkills, linksIn, rewriteLinks } from './lib/skill-files.mjs';

const DIST = path.join(ROOT, 'dist');
const SCRIPT_EXT = new Set(['.js', '.mjs']);
const BUNDLED_EXT = new Set(['.md', ...SCRIPT_EXT]);
const NO_SCRIPT_NOTE =
  '> **Single-file edition.** Reference scripts are not included. Where a step says to run a script, do the same check by hand and mark the numbers `Unverified`.';
const SLIM_NOTE =
  '> **Slim edition.** This skill\'s instructions plus the core rules only. Full standards, catalog and worked examples are in the folder or single-file edition. Where a step says to run a script, do the check by hand and mark the numbers `Unverified`.';
const CORE_RE = /<!-- core -->\n?([\s\S]*?)<!-- \/core -->/g;

const skillOf = (repoPath) => (repoPath.match(/^skills\/([^/]+)\//) || [])[1] || null;
const isScript = (repoPath) => SCRIPT_EXT.has(path.extname(repoPath));

/** Collect every repo file reachable from the skill's SKILL.md through relative links. */
function collect(skill) {
  const start = `skills/${skill}/SKILL.md`;
  const seen = new Set([start]);
  const queue = [start];
  const warnings = [];
  while (queue.length) {
    const file = queue.shift();
    if (path.extname(file) !== '.md') continue;
    const abs = path.join(ROOT, file);
    for (const { target: targetAbs } of linksIn(readFileSync(abs, 'utf8'), abs)) {
      const target = rel(targetAbs);
      if (!BUNDLED_EXT.has(path.extname(target))) continue;
      const other = skillOf(target);
      if (other && other !== skill) warnings.push(`${file} links into another skill (${target}); use the command name instead`);
      else if (!existsSync(targetAbs)) warnings.push(`${file} → missing ${target}`);
      else if (!seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  }
  return { files: [...seen], warnings };
}

/** Flat file name inside references/ or scripts/. */
function flatName(repoPath) {
  const base = path.posix.basename(repoPath);
  const dir = path.posix.basename(path.posix.dirname(repoPath));
  if (base === 'README.md') return `${dir}-readme.md`;
  if (dir === 'locale-packs') return `locale-pack-${base}`;
  return base;
}

/** Map each repo file to its path inside the bundled skill; name collisions are errors. */
function layout(skill, files) {
  const map = new Map();
  const owner = new Map();
  const errors = [];
  for (const file of files) {
    const out = file === `skills/${skill}/SKILL.md` ? 'SKILL.md' : `${isScript(file) ? 'scripts' : 'references'}/${flatName(file)}`;
    if (owner.has(out)) errors.push(`${skill}: ${file} and ${owner.get(out)} both bundle to ${out}`);
    owner.set(out, file);
    map.set(file, out);
  }
  return { map, errors };
}

function bundledFilesSection(map) {
  const rows = [...map.values()].filter((out) => out !== 'SKILL.md').sort();
  return `\n\n## Bundled files\n\nEvery file this skill uses, one link away:\n\n${rows.map((out) => `- [${out}](${out})`).join('\n')}\n`;
}

function bundleFolder(skill, map) {
  const base = path.join(DIST, 'skills', skill);
  for (const [file, out] of map) {
    const abs = path.join(ROOT, file);
    let text = readFileSync(abs, 'utf8');
    if (path.extname(file) === '.md') {
      text = rewriteLinks(text, abs, (target, label, anchor) => {
        const mapped = map.get(rel(target));
        return mapped ? `[${label}](${path.posix.relative(path.posix.dirname(out), mapped)}${anchor})` : null;
      });
    }
    if (out === 'SKILL.md') text = text.trimEnd() + bundledFilesSection(map);
    mkdirSync(path.dirname(path.join(base, out)), { recursive: true });
    writeFileSync(path.join(base, out), text);
  }
}

/** Turn relative links into plain text that says where the target lives in this edition. */
function textLinks(map, where) {
  return (target, label) => {
    const out = map.get(rel(target));
    if (!out) return null;
    return isScript(rel(target)) ? `${label} (script not included — check by hand, mark \`Unverified\`)` : `${label} (${where} \`${out}\`)`;
  };
}

/** SKILL.md with links as text and the edition note placed right after the "# Title". */
function mainText(map, toText, note) {
  const main = [...map.keys()][0];
  const abs = path.join(ROOT, main);
  return rewriteLinks(readFileSync(abs, 'utf8'), abs, toText).replace(/^(---\n[\s\S]*?\n---\n\s*# [^\n]*\n)/, `$1\n${note}\n`);
}

function writeEdition(folder, skill, text) {
  mkdirSync(path.join(DIST, folder), { recursive: true });
  writeFileSync(path.join(DIST, folder, `${skill}.md`), text);
  return Buffer.byteLength(text);
}

const docsOf = (map) => [...map.keys()].filter((f) => !isScript(f)).slice(1);

function bundleSingle(skill, map) {
  const toText = textLinks(map, 'appendix');
  let out = mainText(map, toText, NO_SCRIPT_NOTE);
  for (const file of docsOf(map)) {
    const abs = path.join(ROOT, file);
    out += `\n\n---\n\n# Appendix: \`${map.get(file)}\`\n\n${rewriteLinks(readFileSync(abs, 'utf8'), abs, toText)}`;
  }
  return writeEdition('single', skill, out);
}

function bundleSlim(skill, map) {
  const toText = textLinks(map, 'full edition');
  const core = docsOf(map).flatMap((file) => {
    const abs = path.join(ROOT, file);
    const blocks = [...readFileSync(abs, 'utf8').matchAll(CORE_RE)].map((m) => m[1].trim().replace(/^(#{2,5}) /gm, '#$1 '));
    return blocks.length ? [`## From \`${map.get(file)}\`\n\n${rewriteLinks(blocks.join('\n\n'), abs, toText)}`] : [];
  });
  let out = mainText(map, toText, SLIM_NOTE);
  if (core.length) out = `${out.trimEnd()}\n\n---\n\n# Appendix: core rules\n\n${core.join('\n\n')}\n`;
  return writeEdition('slim', skill, out);
}

rmSync(DIST, { recursive: true, force: true });
const skills = listSkills(path.join(ROOT, 'skills'));
const problems = [];
for (const skill of skills) {
  const { files, warnings } = collect(skill);
  const { map, errors } = layout(skill, files);
  problems.push(...warnings, ...errors);
  if (errors.length) continue;
  bundleFolder(skill, map);
  const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
  console.log(`${skill}: ${files.length} file(s), single ${kb(bundleSingle(skill, map))}, slim ${kb(bundleSlim(skill, map))}`);
}
problems.forEach((p) => console.warn(`WARN ${p}`));
console.log(`\nBundled ${skills.length} skills into dist/skills, dist/single and dist/slim (${problems.length} warning(s)).`);
process.exitCode = problems.length ? 1 : 0;
