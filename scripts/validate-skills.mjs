#!/usr/bin/env node
/*
 * Check skills against the Agent Skills spec (https://agentskills.io/specification) and
 * Figma's skill guide (https://developers.figma.com/docs/figma-mcp-server/create-skills/).
 *
 *   node scripts/validate-skills.mjs            source skills/ + dist/ (if built)
 *
 * Source skills may link to ../../standards etc. (the bundler copies those in).
 * Bundled skills must be self-contained: links stay inside the skill and every file is linked from SKILL.md.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ROOT, rel, listSkills, linksIn, parseFrontmatter } from './lib/skill-files.mjs';

const ALLOWED_KEYS = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools', 'disable-model-invocation']);
const REQUIRED_HEADINGS = ['When to use', 'When not to use', 'Instructions', 'Examples', 'Common edge cases'];
const FIGMA_HEADINGS = ['Prerequisites'];
const MAX_LINES = 500;
const MAX_TOKENS = 5000;
const MAX_KB = { single: 100, slim: 32 };
const REPO_PATH_RE = /`((?:scripts|standards|catalog|skills|evals|docs)\/[\w./-]+\.(?:md|js|mjs))`/g;

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

function checkFrontmatter(where, folder, fm) {
  const { data, raw } = fm;
  for (const key of Object.keys(data)) if (!ALLOWED_KEYS.has(key)) fail(where, `unknown frontmatter key "${key}"`);
  for (const [key, value] of Object.entries(raw)) {
    if (!/^(['"]).*\1$/.test(value) && /: |\s#/.test(value)) fail(where, `${key} needs quotes (": " or " #" breaks YAML)`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.name || '') || data.name.length > 64) fail(where, 'name must be 1–64 lowercase letters, digits and single hyphens');
  if (data.name !== folder) fail(where, `name "${data.name}" must match folder "${folder}"`);
  if (!data.description || data.description.length > 1024) fail(where, 'description is required and must be ≤ 1024 characters');
  if (data.description && !/Do not use/i.test(data.description)) fail(where, 'description must say when NOT to use the skill ("Do not use for …")');
  if (data.compatibility !== undefined && (typeof data.compatibility !== 'string' || data.compatibility.length > 500)) fail(where, 'compatibility must be ≤ 500 characters');
  if (data['disable-model-invocation'] !== undefined && !['true', 'false'].includes(data['disable-model-invocation'])) fail(where, 'disable-model-invocation must be true or false');
  if (data.metadata !== undefined && typeof data.metadata !== 'object') fail(where, 'metadata must be a map');
  for (const key of Object.keys(data.metadata || {})) {
    if (!/^(['"]).*\1$/.test(raw[`metadata.${key}`]) && /^(\d+(\.\d+)?|true|false|null)$/.test(data.metadata[key])) {
      fail(where, `metadata.${key} must be a quoted string`);
    }
  }
}

function checkBody(where, fm, isFigma) {
  const lines = fm.body.split('\n');
  if (lines.length > MAX_LINES) fail(where, `body has ${lines.length} lines (max ${MAX_LINES})`);
  const tokens = Math.round(fm.body.length / 4);
  if (tokens > MAX_TOKENS) fail(where, `body is about ${tokens} tokens (max ${MAX_TOKENS})`);
  if (!lines.find((l) => l.trim())?.startsWith('# ')) fail(where, 'body must start with a "# Title"');
  const headings = new Set(lines.filter((l) => l.startsWith('## ')).map((l) => l.slice(3).trim()));
  for (const h of [...REQUIRED_HEADINGS, ...(isFigma ? FIGMA_HEADINGS : [])]) if (!headings.has(h)) fail(where, `missing "## ${h}"`);
  if (isFigma && !(fm.body.includes('figma-use') && fm.body.includes('skillNames'))) {
    fail(where, 'Figma skills must require the figma-use skill and pass skillNames');
  }
}

function checkLinks(where, fileAbs, text, insideDir) {
  for (const { href, target } of linksIn(text, fileAbs)) {
    if (!existsSync(target)) fail(where, `broken link ${href}`);
    else if (insideDir && !target.startsWith(insideDir + path.sep)) fail(where, `link leaves the skill folder: ${href}`);
  }
}

function filesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const abs = path.join(dir, name);
    return statSync(abs).isDirectory() ? filesUnder(abs) : [abs];
  });
}

function checkSkill(skillDir, { bundled }) {
  const folder = path.basename(skillDir);
  const skillFile = path.join(skillDir, 'SKILL.md');
  const where = rel(skillFile);
  const text = readFileSync(skillFile, 'utf8');
  const fm = parseFrontmatter(text);
  if (!fm) return fail(where, 'missing YAML frontmatter');
  checkFrontmatter(where, folder, fm);
  const isFigma = fm.data.metadata?.['mcp-server'] === 'figma';
  if (!bundled) checkBody(where, fm, isFigma);
  checkLinks(where, skillFile, text, bundled ? skillDir : null);
  if (!bundled) return;

  const linkedFromMain = new Set(linksIn(text, skillFile).map((l) => l.target));
  for (const file of filesUnder(skillDir)) {
    if (file === skillFile) continue;
    if (!linkedFromMain.has(file)) fail(rel(file), 'not linked from SKILL.md (must be one hop away)');
    if (file.endsWith('.md')) checkLinks(rel(file), file, readFileSync(file, 'utf8'), skillDir);
  }
}

function checkSingleFile(file, edition) {
  const text = readFileSync(file, 'utf8');
  if (!parseFrontmatter(text)) fail(rel(file), 'missing YAML frontmatter');
  if (/```(javascript|js)\n/.test(text) && /figma\.(variables|root|createFrame)/.test(text)) fail(rel(file), `${edition} edition must not embed reference scripts`);
  if (linksIn(text, file).length) fail(rel(file), `${edition} edition must not contain relative links`);
  const kb = Buffer.byteLength(text) / 1024;
  if (kb > MAX_KB[edition]) fail(rel(file), `${edition} edition is ${kb.toFixed(0)} KB (max ${MAX_KB[edition]} KB)`);
}

/** Backticked repo paths in docs (for example `scripts/figma/contrast-pairs.js`) must exist. History files are skipped. */
function checkRepoPaths() {
  const docs = ['README.md', ...['skills', 'standards', 'catalog', 'evals', 'scripts'].flatMap((d) => filesUnder(path.join(ROOT, d)).map((f) => rel(f)))]
    .filter((f) => f.endsWith('.md'));
  for (const doc of docs) {
    for (const [, repoPath] of readFileSync(path.join(ROOT, doc), 'utf8').matchAll(REPO_PATH_RE)) {
      if (!existsSync(path.join(ROOT, repoPath))) fail(doc, `mentions missing file \`${repoPath}\``);
    }
  }
}

const sourceSkills = listSkills(path.join(ROOT, 'skills'));
sourceSkills.forEach((s) => checkSkill(path.join(ROOT, 'skills', s), { bundled: false }));
checkRepoPaths();

const distSkills = path.join(ROOT, 'dist', 'skills');
listSkills(distSkills).forEach((s) => checkSkill(path.join(distSkills, s), { bundled: true }));
for (const edition of Object.keys(MAX_KB)) {
  const dir = path.join(ROOT, 'dist', edition);
  if (existsSync(dir)) readdirSync(dir).filter((f) => f.endsWith('.md')).forEach((f) => checkSingleFile(path.join(dir, f), edition));
}

errors.forEach((e) => console.error(`FAIL ${e}`));
console.log(`\nChecked ${sourceSkills.length} source skills${existsSync(distSkills) ? ' and dist/' : ''}: ${errors.length} problem(s).`);
process.exitCode = errors.length ? 1 : 0;
