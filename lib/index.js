'use strict';

const HEADING = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const FENCE = /^(```|~~~)/;

function slugify(text, seen) {
  let slug = text
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const count = seen.get(slug) || 0;
  seen.set(slug, count + 1);
  if (count > 0) slug = `${slug}-${count}`;
  return slug;
}

function parseHeadings(markdown, { minDepth = 1, maxDepth = 6 } = {}) {
  const seen = new Map();
  const headings = [];
  let inFence = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (FENCE.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = HEADING.exec(line);
    if (!m) continue;
    const depth = m[1].length;
    const text = m[2];
    const slug = slugify(text, seen);
    if (depth < minDepth || depth > maxDepth) continue;
    headings.push({ depth, text, slug });
  }
  return headings;
}

function toc(markdown, options = {}) {
  const headings = parseHeadings(markdown, options);
  if (headings.length === 0) return '';
  const base = Math.min(...headings.map((h) => h.depth));
  const bullet = options.bullet || '-';
  return headings
    .map((h) => `${'  '.repeat(h.depth - base)}${bullet} [${h.text}](#${h.slug})`)
    .join('\n');
}

const START = '<!-- toc -->';
const END = '<!-- tocstop -->';

function inject(markdown, options = {}) {
  const start = markdown.indexOf(START);
  const end = markdown.indexOf(END);
  if (start === -1 || end === -1 || end < start) return markdown;
  const body = markdown.slice(0, start) + markdown.slice(end + END.length);
  return `${markdown.slice(0, start)}${START}\n\n${toc(body, options)}\n\n${markdown.slice(end)}`;
}

module.exports = { slugify, parseHeadings, toc, inject };
